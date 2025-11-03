export type ExtractType<T, K extends keyof T> = T[K] extends undefined | null ? T[K] : NonNullable<T[K]>;
