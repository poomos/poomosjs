export type FormoScalar = string | boolean | number | Date;
export type FormoScalarArray = string[] | boolean[] | number[] | Date[];
export type FormoScalarOrArrayScalar =
  | string
  | boolean
  | number
  | Date
  | string[]
  | boolean[]
  | number[]
  | Date[];
export type FormoObject = Record<string, any>;
export type FormoRequiredType<T> = {
  [K in keyof T]: Required<FormoRequiredType<T[K]>>;
};
