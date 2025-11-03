import {
  type StateCreator,
  type StoreApi,
  type StoreMutatorIdentifier,
  type UseBoundStore,
  create as actualCreate,
} from 'zustand';

const storeResetFns = new Set<() => void>();

export function resetAllStores() {
  storeResetFns.forEach((resetFn) => {
    resetFn();
  });
}

// prettier-ignore
export const create = (<T,>() => {
  return (stateCreator: StateCreator<T>) => {
    const store = actualCreate(stateCreator);
    storeResetFns.add(() => {
      store.setState(store.getInitialState(), true);
    });
    return store;
  };
}) as typeof actualCreate;

type WithSelectors<S> = S extends { getState: () => infer T } ? S & { use: { [K in keyof T]: () => T[K] } } : never;

export const createSelectors = <S extends UseBoundStore<StoreApi<object>>>(_store: S) => {
  const store = _store as WithSelectors<typeof _store>;
  store.use = {};
  for (const k of Object.keys(store.getState())) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (store.use as any)[k] = () => store((s) => s[k as keyof typeof s]);
  }

  return store;
};

type Logger = <
  T,
  Mps extends [StoreMutatorIdentifier, unknown][] = [],
  Mcs extends [StoreMutatorIdentifier, unknown][] = [],
>(
  f: StateCreator<T, Mps, Mcs>,
  name?: string
) => StateCreator<T, Mps, Mcs>;

type LoggerImpl = <T>(f: StateCreator<T, [], []>, name?: string) => StateCreator<T, [], []>;

const loggerImpl: LoggerImpl = (f, name) => (set, get, store) => {
  if (process.env.NODE_ENV === 'development') {
    const loggedSet: typeof set = (...a) => {
      set(...(a as Parameters<typeof set>));
      console.info(...(name ? [`${name}:`] : []), get());
    };
    const setState = store.setState;
    store.setState = (...a) => {
      setState(...(a as Parameters<typeof setState>));
      console.info(...(name ? [`${name}:`] : []), store.getState());
    };

    return f(loggedSet, get, store);
  }
  return f(set, get, store);
};

export const logger = loggerImpl as unknown as Logger;

