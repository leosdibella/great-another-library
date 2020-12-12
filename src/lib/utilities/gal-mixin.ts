import { isFunction, isNonEmptyString } from './utilities';

const galMixins: Record<string, Function> = {};

export function GalMixin(mixinAttributeName: string) {
  return function <T extends Function>(constructor: T) {
    if (!isFunction(constructor)) {
      throw new Error(
        'GalMixin constructor error: constructor is not a function!'
      );
    }

    if (!isNonEmptyString(mixinAttributeName)) {
      throw new Error(
        'GalMixin constructor error: mixinAttributeName cannot be empty!'
      );
    }

    if (galMixins[mixinAttributeName]) {
      throw new Error(
        'GalMixin constructor error: duplicate mixin name detected!'
      );
    }

    galMixins[mixinAttributeName] = constructor;

    constructor.prototype.galMixinAttributeName = mixinAttributeName;

    return constructor;
  };
}

export function getGalMixin(mixinAttributeName: string): Function | undefined {
  return galMixins[mixinAttributeName];
}
