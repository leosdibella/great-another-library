export enum GalAttribute {
  event = 'event',
  mixin = 'mixin'
}

export const galAttributes = Object.keys(GalAttribute).map(
  (at) => GalAttribute[at as GalAttribute]
);
