// expands object type for vs code intellisense
export type Expand<T> = T extends infer O ? { [K in keyof O]: O[K] } : never;

// expands object types recursively for vs code intellisense
export type ExpandRecursively<T> = T extends object
    ? T extends infer O
    ? { [K in keyof O]: ExpandRecursively<O[K]> }
    : never
    : T;

export interface TypedRequestBody<T> extends Express.Request {
    body: T
}