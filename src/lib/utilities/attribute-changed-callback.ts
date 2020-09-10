import { IGalObservable, IGalEventHistory } from './interfaces';
import { galEventPrefix } from './gal-parser';

export function generateAttributeChangedCallback<
  S extends CustomElementConstructor
>(
  customElement: S,
  eventListeners: Record<string, IGalEventHistory | undefined>,
  instance: HTMLElement
) {
  return function attributeChangedCallback(
    name: string,
    from: string,
    to: string
  ) {
    if (from === to) {
      return;
    }

    const listener = eventListeners[name];
    const observedProperties = ((customElement.prototype as unknown) as IGalObservable)
      .galObservedPropeties;

    if (listener) {
      this.removeEventListener(from, listener.eventFunction);
      eventListeners[name] = undefined;
    }

    if (to.indexOf(galEventPrefix) === 0) {
      eventListeners[name] = {
        eventName: to,
        eventFunction: (event: CustomEvent<unknown>) => {
          if (observedProperties) {
            (this[
              observedProperties[name] as keyof HTMLElement
            ] as unknown) = event.detail;
          }
        }
      };

      this.addEventListener(to, eventListeners[name]!.eventFunction);
    } else if (observedProperties) {
      (this[observedProperties[name] as keyof HTMLElement] as unknown) = to;
    }
  }.bind(instance);
}
