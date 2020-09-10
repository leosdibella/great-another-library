import {
  IGalEventHistory,
  IGalExtendedCustomElement,
  IGalObservable,
  IGalHostable
} from './interfaces';
import { generateAttributeChangedCallback } from './attribute-changed-callback';
import { bindGalEvents } from './bind-gal-events';

export function GalExtendedCustomElement(
  galExtendedCustomElement: IGalExtendedCustomElement
) {
  return function <S extends CustomElementConstructor>(customElement: S) {
    const galExtendedCustomElementDefintion = class GalExtendedCustomElementDefintion extends customElement {
      public static get observedAttributes() {
        return (
          ((customElement.prototype as unknown) as IGalObservable)
            .galObservedAttributees || []
        );
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

        bindGalEvents(
          this,
          ((customElement.prototype as unknown) as IGalHostable)
            .galHostEvents || []
        );
      }
    };

    customElements.define(
      galExtendedCustomElement.is,
      galExtendedCustomElementDefintion,
      { extends: galExtendedCustomElement.extends }
    );

    return galExtendedCustomElementDefintion;
  };
}
