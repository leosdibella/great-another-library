interface IStorage {
  getItem<T>(key: string): T | undefined;
  clear(): void;
  removeItem(key: string): void;
  setItem<T>(key: string, value: T): void;
  key(index: number): string | undefined;
  length: number;
}

let globalInMemoryStorage: Record<string, string> = {};

export function typeSafeStorage(storage?: Storage, globallyLinked: boolean = false): IStorage {
  let inMemoryStorage: Record<string, string> = globallyLinked
      ? globalInMemoryStorage
      : {};

  function getItem<T>(key: string): T | undefined {
    const stringifiedItem = (storage ? storage.getItem(key) : inMemoryStorage[key]) || undefined;

    return stringifiedItem ? JSON.parse(stringifiedItem) : undefined;
  }

  function clear() {
    if (storage) {
      storage.clear();

      return;
    }

    inMemoryStorage = {};

    if (globallyLinked) {
      globalInMemoryStorage = inMemoryStorage;
    }
  }

  function key(index: number) {
    return storage ? storage.key(index) || undefined : Object.keys(inMemoryStorage)[index];
  }

  function removeItem(key: string) {
    storage ? storage.removeItem(key) : delete inMemoryStorage[key];
  }

  function setItem<T>(key: string, value: T) {
    const stringifiedItem = JSON.stringify(value);

    storage ? storage.setItem(key, stringifiedItem) : inMemoryStorage[key] = stringifiedItem;
  }

  return {
    clear,
    getItem,
    key,
    removeItem,
    setItem,
    get length() {
      return Object.keys(inMemoryStorage).length;
    }
  };
}

export const typeSafeLocalStorage = typeSafeStorage(localStorage);
export const typeSafeSessionStorage = typeSafeStorage(sessionStorage);
export const typeSafeInMemoryStorage = typeSafeStorage(undefined, true);