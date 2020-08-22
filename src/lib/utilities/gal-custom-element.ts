import { isNonEmptyString, kebabCaseToCamelCase } from './utilities';
import { IGalParsedHtml, parseGalHtml } from './gal-parser';

export interface IGalCustomElement<T> {
  tag: string;
  html: string;
  styles?: string;
  observedAttributes?: Record<string, keyof T | ''>;
  observedAttributesMapName?: keyof T;
}

export interface IGalExtendedCustomElement<T> {
  is: string;
  extends: string;
  observedAttributes?: Record<string, keyof T | ''>;
  observedAttributesMapName?: keyof T;
}

function getObservedAttributes<T>(
  preObservedAttributesMap: Record<string, keyof T | ''>,
) {
  const observedAttributes: string[] = Object.keys(preObservedAttributesMap);
  const observedAttributesMap: Record<string, keyof T> = {};

  for (let i = 0; i < observedAttributes.length; ++i) {
    const attribute = observedAttributes[i];
    const classProperty = (preObservedAttributesMap[attribute] ||
      kebabCaseToCamelCase(attribute)) as keyof T;

    observedAttributesMap[attribute] = classProperty;
  }

  return {
    observedAttributes,
    observedAttributesMap,
  };
}

export function GalCustomElement<T>(galCustomElement: IGalCustomElement<T>) {
  return function <S extends CustomElementConstructor>(customElement: S) {
    const template = document.createElement('template');

    const { observedAttributes, observedAttributesMap } = getObservedAttributes<
      T
    >(galCustomElement.observedAttributes || {});

    if (!isNonEmptyString(galCustomElement.tag)) {
      throw new Error(
        'GalCustomElement constructor error: tag cannot be empty!',
      );
    }

    const templateId = `${galCustomElement.tag}-template`;

    if (customElements.get(galCustomElement.tag)) {
      throw new Error(
        'GalCustomElement constructor error: duplicate custom element tag detected!',
      );
    }

    const parsedHtml = parseGalHtml(galCustomElement.html);

    if (!parsedHtml) {
      throw new Error(
        'GalCustomElement constructor error: unable to parse valid html from template!',
      );
    }

    template.setAttribute('id', templateId);
    template.innerHTML = `${galCustomElement.styles || ''}${
      parsedHtml.template
    }`;

    const galCustomElementDefintion = class GalCustomElementDefinition extends customElement {
      public static get observedAttributes() {
        return observedAttributes;
      }

      public static get tag() {
        return galCustomElement.tag;
      }

      public attributeChangedCallback(name: string, from: string, to: string) {
        if (!galCustomElement.observedAttributesMapName) {
          throw new Error(
            'GalCustomElement attributeChangedCallback error: no observed attributes handler map name detected!',
          );
        }

        if (from === to) {
          return;
        }

        const attributesMap = this[
          galCustomElement.observedAttributesMapName as keyof this
        ];

        if (typeof attributesMap !== 'object' || attributesMap === null) {
          throw new Error(
            'GalCustomElement attributeChangedCallback error: no observed attributes handler map object detected!',
          );
        }

        const attributeChangeHandler = (attributesMap as Partial<
          Record<keyof T, (from: string, to: string) => void>
        >)[observedAttributesMap[name]];

        if (attributeChangeHandler) {
          attributeChangeHandler(from, to);
        }
      }

      constructor(...args: any[]) {
        super();

        this.attachShadow({ mode: 'open' }).appendChild(
          template.content.cloneNode(true),
        );
        const events = (parsedHtml as IGalParsedHtml).events;

        for (let i = 0; i < events.length; ++i) {
          const event = this[
            events[i].eventFunctionName as keyof this
          ] as this[keyof this] & ((event: Event) => void);

          if (typeof event !== 'function' || !this.shadowRoot) {
            continue;
          }

          const eventBoundElement = this.shadowRoot.querySelectorAll(
            events[i].querySelector,
          )[events[i].querySelectorIndex];

          if (!eventBoundElement) {
            continue;
          }

          eventBoundElement.addEventListener(
            events[i].eventName,
            event.bind(this),
          );
        }
      }
    };

    customElements.define(galCustomElement.tag, galCustomElementDefintion);
    document.body.appendChild(template);

    return galCustomElementDefintion;
  };
}

export function GalExtendedCustomElement<T>(
  galExtendedCustomElement: IGalExtendedCustomElement<T>,
) {
  return function <S extends CustomElementConstructor>(customElement: S) {
    const { observedAttributes, observedAttributesMap } = getObservedAttributes<
      T
    >(galExtendedCustomElement.observedAttributes || {});

    const galExtendedCustomElementDefintion = class GalExtendedCustomElementDefintion extends customElement {
      public static get observedAttributes() {
        return observedAttributes;
      }

      public attributeChangedCallback(name: string, from: string, to: string) {
        if (!galExtendedCustomElement.observedAttributesMapName) {
          throw new Error(
            'GalExtendedCustomElement attributeChangedCallback error: no observed attributes handler map name detected!',
          );
        }

        if (from === to) {
          return;
        }

        const attributesMap = this[
          galExtendedCustomElement.observedAttributesMapName as keyof this
        ];

        if (typeof attributesMap !== 'object' || attributesMap === null) {
          throw new Error(
            'GalExtendedCustomElement attributeChangedCallback error: no observed attributes handler map object detected!',
          );
        }

        const attributeChangeHandler = (attributesMap as Partial<
          Record<keyof T, (from: string, to: string) => void>
        >)[observedAttributesMap[name]];

        if (attributeChangeHandler) {
          attributeChangeHandler(from, to);
        }
      }

      constructor(...args: any[]) {
        super();
      }
    };

    customElements.define(
      galExtendedCustomElement.is,
      galExtendedCustomElementDefintion,
      { extends: galExtendedCustomElement.extends },
    );

    return galExtendedCustomElementDefintion;
  };
}
