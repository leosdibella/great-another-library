import { IGalEventBinding } from './interfaces';
import { isFunction, isWellDefined } from './utilities';

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
      events[i].querySelector && isWellDefined(events[i].querySelectorIndex)
        ? instance.shadowRoot!.querySelectorAll(
            events[i].querySelector!.replace(/\:/g, '\\:')
          )[events[i].querySelectorIndex!]
        : instance;

    if (eventBoundElement) {
      eventBoundElement.addEventListener(
        events[i].eventName,
        event.bind(instance)
      );
    }
  }
}
