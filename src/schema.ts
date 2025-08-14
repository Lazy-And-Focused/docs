export type Schema = {
  [name: string]: string|Schema|[string, Schema]
};