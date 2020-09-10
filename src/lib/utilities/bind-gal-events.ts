import { IGalEventBinding } from './interfaces';
import { isFunction } from './utilities';

export function bindGalEvents(
  instance: HTMLElement,
  events: IGalEventBinding[]
) {
  for (let i = 0; i < events.length; ++i) {
    const event = instance[
      events[i].eventFunctionName as keyof HTMLElement
    ] as HTMLElement[keyof HTMLElement] & ((event: Event) => void);

    if (!isFunction(event)) {
      continue;
    }

    const eventBoundElement =
      events[i].querySelector && events[i].querySelectorIndex !== undefined
        ? instance.shadowRoot!.querySelectorAll(
            events[i].querySelector!.replace(/\:/g, '\\:')
          )[events[i].querySelectorIndex!]
        : instance;

    if (!eventBoundElement) {
      continue;
    }

    eventBoundElement.addEventListener(
      events[i].eventName,
      event.bind(instance)
    );
  }
}
