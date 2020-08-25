import { isNonEmptyString, camelCaseToKebabCase, uuid } from './utilities';
import { IGalParsedHtml, parseGalHtml } from './gal-parser';

interface GalEventHistory {
  eventName: string;
  eventFunction(customEvent: CustomEvent<unknown>): void;
}

export const galEventPrefix = '_GalEvent_';

export function generatePropertySetter<T, S = undefined>(
  element: HTMLElement,
  property: keyof T,
  initialValue?: S,
) {
  const eventName = `${galEventPrefix}${uuid()}`;
  const attribute = camelCaseToKebabCase(property as string);
  element.setAttribute(attribute, eventName);

  function setProperty(nextValue: S) {
    element.dispatchEvent(
      new CustomEvent(eventName, {
        detail: nextValue,
      }),
    );
  }

  if (arguments.length === 3) {
    setProperty(initialValue as S);
  }

  return setProperty;
}

export interface IGalCustomElement<T> {
  tag: string;
  html: string;
  styles?: string;
  observedAttributes?: (keyof T)[];
  refireAttributeChanged?: boolean;
}

export interface IGalExtendedCustomElement<T> {
  is: string;
  extends: string;
  observedAttributes?: (keyof T)[];
  refireAttributeChanged?: boolean;
}

function getObservedAttributes<T>(preObservedAttributes: (keyof T)[]) {
  const observedAttributes: string[] = preObservedAttributes.map((tProperty) =>
    camelCaseToKebabCase(tProperty as string),
  );

  const observedAttributesMap: Record<string, keyof T> = {};

  observedAttributes.forEach((oa, i) => {
    observedAttributesMap[oa] = preObservedAttributes[i];
  });

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
    >(galCustomElement.observedAttributes || []);

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

      #eventListeners: Record<string, GalEventHistory | undefined> = {};

      public attributeChangedCallback(name: string, from: string, to: string) {
        if (from === to && !galCustomElement.refireAttributeChanged) {
          return;
        }

        const listener = this.#eventListeners[name];

        if (to.indexOf(galEventPrefix) === 0) {
          if (listener) {
            this.removeEventListener(from, listener.eventFunction);
            this.#eventListeners[name] = undefined;
          }

          this.#eventListeners[name] = {
            eventName: to,
            eventFunction: (event: CustomEvent<unknown>) => {
              (this[
                observedAttributesMap[name] as keyof this
              ] as unknown) = event.detail;
            },
          };

          this.addEventListener(to, this.#eventListeners[name]!.eventFunction);
        } else {
          if (listener) {
            this.removeEventListener(from, listener.eventFunction);
            this.#eventListeners[name] = undefined;
          }

          ((this[
            observedAttributesMap[name] as keyof this
          ] as unknown) as string) = to;
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
            events[i].querySelector.replace(/\:/g, '\\:'),
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
    >(galExtendedCustomElement.observedAttributes || []);

    const galExtendedCustomElementDefintion = class GalExtendedCustomElementDefintion extends customElement {
      public static get observedAttributes() {
        return observedAttributes;
      }

      #eventListeners: Record<string, GalEventHistory | undefined> = {};

      public attributeChangedCallback(name: string, from: string, to: string) {
        if (from === to && !galExtendedCustomElement.refireAttributeChanged) {
          return;
        }

        const listener = this.#eventListeners[name];

        if (to.indexOf(galEventPrefix) === 0) {
          if (listener) {
            this.removeEventListener(from, listener.eventFunction);
            this.#eventListeners[name] = undefined;
          }

          this.#eventListeners[name] = {
            eventName: to,
            eventFunction: (event: CustomEvent<unknown>) => {
              (this[
                observedAttributesMap[name] as keyof this
              ] as unknown) = event.detail;
            },
          };

          this.addEventListener(to, this.#eventListeners[name]!.eventFunction);
        } else {
          if (listener) {
            this.removeEventListener(from, listener.eventFunction);
            this.#eventListeners[name] = undefined;
          }

          ((this[
            observedAttributesMap[name] as keyof this
          ] as unknown) as string) = to;
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
