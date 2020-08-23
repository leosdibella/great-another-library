export function isNonEmptyString(value: unknown) {
  return typeof value === 'string' && value.length > 0;
}

export function isWellDefined(value: unknown) {
  return value !== undefined && value !== null;
}

export function uuid() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    var r = (Math.random() * 16) | 0,
      v = c == 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

export const doNothing = () => {};

export function toCamelCase(string: string, delineator: string) {
  if (!isNonEmptyString(string)) {
    return '';
  }

  return string
    .split(delineator)
    .map(
      (word, i) =>
        `${
          i > 0 ? word[0].toUpperCase() : word[0].toLowerCase()
        }${word.substring(1, word.length)}`,
    )
    .join('');
}

export function kebabCaseToCamelCase(string: string) {
  return toCamelCase(string, '-');
}

export function camelCaseToKebabCase(string: string) {
  if (!isNonEmptyString(string)) {
    return '';
  }

  let kebabCase = '';
  let char: string;

  for (let i = 0; i < string.length; ++i) {
    char = string[i].toLowerCase();
    kebabCase += char !== string[i] ? '-' : '';
    kebabCase += char;
  }

  return kebabCase;
}

export function attributeToBoolean(attribute: unknown) {
  return isWellDefined(attribute) && `${attribute}` !== 'false';
}
