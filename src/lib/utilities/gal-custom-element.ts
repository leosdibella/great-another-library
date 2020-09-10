import { isNonEmptyString } from './utilities';
import { parseGalHtml } from './gal-parser';
import {
  IGalParsedHtml,
  IGalCustomElement,
  IGalEventHistory,
  IGalObservable,
  IGalHostable
} from './interfaces';
import { generateAttributeChangedCallback } from './attribute-changed-callback';

export function GalCustomElement(galCustomElement: IGalCustomElement) {
  return function <S extends CustomElementConstructor>(customElement: S) {
    const template = document.createElement('template');

    if (!isNonEmptyString(galCustomElement.tag)) {
      throw new Error(
        'GalCustomElement constructor error: tag cannot be empty!'
      );
    }

    const templateId = `${galCustomElement.tag}-template`;

    if (customElements.get(galCustomElement.tag)) {
      throw new Error(
        'GalCustomElement constructor error: duplicate custom element tag detected!'
      );
    }

    const parsedHtml = parseGalHtml(galCustomElement.html);

    if (!parsedHtml) {
      throw new Error(
        'GalCustomElement constructor error: unable to parse valid html from template!'
      );
    }

    template.setAttribute('id', templateId);

    template.innerHTML = `${galCustomElement.styles || ''}${
      parsedHtml.template
    }`;

    const galCustomElementDefintion = class GalCustomElementDefinition extends customElement {
      public static get observedAttributes() {
        return (
          ((customElement.prototype as unknown) as IGalObservable)
            .galObservedAttributees || []
        );
      }

      public static get tag() {
        return galCustomElement.tag;
      }

      #eventListeners: Record<string, IGalEventHistory | undefined> = {};
      #attributeChangedCallback: (
        name: string,
        from: string,
        to: string
      ) => void = generateAttributeChangedCallback(
        customElement,
        this.#eventListeners,
        this
      );

      public attributeChangedCallback(name: string, from: string, to: string) {
        this.#attributeChangedCallback(name, from, to);
      }

      constructor(...args: any[]) {
        super();

        this.attachShadow({ mode: 'open' }).appendChild(
          template.content.cloneNode(true)
        );

        const events = [
          ...(parsedHtml as IGalParsedHtml).events,
          ...(((customElement.prototype as unknown) as IGalHostable)
            .galHostEvents || [])
        ];

        for (let i = 0; i < events.length; ++i) {
          const event = this[
            events[i].eventFunctionName as keyof this
          ] as this[keyof this] & ((event: Event) => void);

          if (typeof event !== 'function') {
            continue;
          }

          const eventBoundElement =
            events[i].querySelector &&
            events[i].querySelectorIndex !== undefined
              ? this.shadowRoot!.querySelectorAll(
                  events[i].querySelector!.replace(/\:/g, '\\:')
                )[events[i].querySelectorIndex!]
              : this;

          if (!eventBoundElement) {
            continue;
          }

          eventBoundElement.addEventListener(
            events[i].eventName,
            event.bind(this)
          );
        }
      }
    };

    customElements.define(galCustomElement.tag, galCustomElementDefintion);
    document.body.appendChild(template);

    return galCustomElementDefintion;
  };
}
