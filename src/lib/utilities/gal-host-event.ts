import { IGalHostable } from './interfaces';
import { isFunction } from './utilities';

export function GalHostEvent(eventName: string) {
  return function (target: HTMLElement, propertyKey: string) {
    const targetType = (target as unknown) as IGalHostable;

    if (!targetType.galHostEvents) {
      targetType.galHostEvents = [];
    }

    if (!isFunction(target[propertyKey as keyof HTMLElement])) {
      throw new Error('GalHostEvent: property must be a function');
    }

    targetType.galHostEvents.push({
      eventFunctionName: propertyKey,
      eventName
    });
  };
}
