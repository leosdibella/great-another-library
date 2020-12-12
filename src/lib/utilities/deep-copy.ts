import { isObject } from './utilities';

const primitiveTypes: string[] = [
  'boolean',
  'string',
  'number',
  'bigint',
  'undefined',
  'symbol'
];

function isPrimitive(value: unknown) {
  return primitiveTypes.indexOf(typeof value) > -1;
}

function isNonReferential(value: unknown) {
  return isPrimitive(value) || value === null || value instanceof Date;
}

interface IProperty {
  path: string[];
  value: unknown;
}

interface ICopy {
  skipExpansion: boolean;
  copiedPropertyValue: unknown;
}

function copyValue(value: unknown): unknown {
  if (isPrimitive(value) || value === null) {
    return value;
  }

  return Array.isArray(value)
    ? []
    : isObject(value)
    ? value instanceof Date
      ? new Date(value)
      : {}
    : undefined;
}

function getProperties(property: IProperty): IProperty[] {
  return Object.keys(property.value as Record<string, unknown>).map((p) => ({
    path: [...property.path, p],
    value: (property.value as Record<string, unknown>)[p]
  }));
}

function mapFromPath(
  property: IProperty,
  root: Record<string, unknown>,
  value: unknown
) {
  let isValidPath = true;
  let reference = root;

  for (let i = 0; i < property.path.length - 1; ++i) {
    if (isObject(reference)) {
      reference = reference[property.path[i]] as Record<string, unknown>;
    } else {
      isValidPath = false;
    }
  }

  if (isValidPath && isObject(reference)) {
    reference[property.path[property.path.length - 1]] = value;
  }
}

function getCopy(
  referenceMap: Map<unknown, unknown>,
  property: IProperty
): ICopy {
  const isReferential = !isNonReferential(property.value);

  if (!isReferential) {
    return {
      copiedPropertyValue: property.value,
      skipExpansion: true
    };
  }

  const existingCopy = referenceMap.get(property.value);
  let copiedPropertyValue: unknown;

  if (existingCopy) {
    copiedPropertyValue = existingCopy;
  } else {
    referenceMap.set(property.value, copiedPropertyValue);
    copiedPropertyValue = copyValue(property.value);
  }

  return {
    copiedPropertyValue,
    skipExpansion: copiedPropertyValue === existingCopy
  };
}

export function deepCopy(value: unknown) {
  const copy = copyValue(value);

  if (isNonReferential(copy)) {
    return copy;
  }

  const referenceMap = new Map<unknown, unknown>();

  const stack = getProperties({
    path: [],
    value
  });

  while (stack.length) {
    const property = stack.pop()!;

    const { skipExpansion, copiedPropertyValue } = getCopy(
      referenceMap,
      property
    );

    mapFromPath(property, copy as Record<string, unknown>, copiedPropertyValue);

    if (!skipExpansion) {
      const properties = getProperties(property);

      for (let i = 0; i < properties.length; ++i) {
        stack.push(properties[i]);
      }
    }
  }

  return copy;
}
