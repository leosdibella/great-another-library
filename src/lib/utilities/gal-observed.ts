import { IGalObservable } from './interfaces/i-gal-observable';
import { camelCaseToKebabCase } from './utilities';

export function GalObserved() {
  return function (target: HTMLElement, propertyKey: string) {
    const targetType = (target as unknown) as IGalObservable;

    if (!targetType.galObservedAttributees) {
      targetType.galObservedAttributees = [];
    }

    if (!targetType.galObservedPropeties) {
      targetType.galObservedPropeties = {};
    }

    const attribute = camelCaseToKebabCase(propertyKey);

    targetType.galObservedAttributees.push(attribute);
    (targetType.galObservedPropeties[attribute] as unknown) = propertyKey;
  };
}
