export function isNonEmptyString(value: unknown) {
  return typeof value === 'string' && value.length > 0;
}

export function isWellDefined(value: unknown) {
  return value !== undefined && value !== null;
}

export function isObject(value: unknown) {
  return typeof value === 'object' && value !== null;
}

export function isFunction(value: unknown) {
  return typeof value === 'function';
}

export function uuid() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    const r = (Math.random() * 16) | 0;

    return (c === 'x' ? r : (r & 0x3) | 0x8).toString(16);
  });
}

export const doNothing = () => {};

function isAlpha(value?: string) {
  const charCode = (value || '').charCodeAt(0);

  return (charCode > 64 && charCode < 91) || (charCode > 96 && charCode < 123);
}

export function camelCaseToKebabCase(string: string) {
  if (!isNonEmptyString(string)) {
    return '';
  }

  let kebabCase = '';
  let char: string;

  for (let i = 0; i < string.length; ++i) {
    char = string[i].toLowerCase();
    kebabCase +=
      (char !== string[i] && isAlpha(string[i - 1]) ? '-' : '') + char;
  }

  return kebabCase;
}

export function attributeToBoolean(attribute: unknown) {
  return isWellDefined(attribute) && `${attribute}` !== 'false';
}
