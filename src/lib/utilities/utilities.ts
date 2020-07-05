export function isNonEmptyString(value: unknown) {
  return typeof value === 'string' && value;
}