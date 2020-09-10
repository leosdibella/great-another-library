export interface IGalObservable<T = unknown> {
  new (): IGalObservable;
  galObservedAttributees: string[];
  galObservedPropeties: Record<string, keyof T>;
}
