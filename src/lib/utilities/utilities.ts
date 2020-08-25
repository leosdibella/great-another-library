export function isNonEmptyString(value: unknown) {
  return typeof value === 'string' && value.length > 0;
}

export function isWellDefined(value: unknown) {
  return value !== undefined && value !== null;
}

export function uuid() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    const r = (Math.random() * 16) | 0;

    return (c === 'x' ? r : (r & 0x3) | 0x8).toString(16);
  });
}

export const doNothing = () => {};

export function camelCaseToKebabCase(string: string) {
  if (!isNonEmptyString(string)) {
    return '';
  }

  let kebabCase = '';
  let char: string;

  for (let i = 0; i < string.length; ++i) {
    char = string[i].toLowerCase();
    kebabCase += (char !== string[i] ? '-' : '') + char;
  }

  return kebabCase;
}

export function attributeToBoolean(attribute: unknown) {
  return isWellDefined(attribute) && `${attribute}` !== 'false';
}
