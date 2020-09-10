import { camelCaseToKebabCase, uuid } from './utilities';
import { galEventPrefix } from './gal-parser';

export function generatePropertySetter<T, S = undefined>(
  element: HTMLElement,
  property: keyof T,
  initialValue?: S
) {
  const eventName = `${galEventPrefix}${uuid()}`;
  const attribute = camelCaseToKebabCase(property as string);
  element.setAttribute(attribute, eventName);

  function setProperty(nextValue: S) {
    element.dispatchEvent(
      new CustomEvent(eventName, {
        detail: nextValue
      })
    );
  }

  if (arguments.length === 3) {
    setProperty(initialValue as S);
  }

  return setProperty;
}
