import { FormoFieldSchema } from '../field/formo-field.schema';
import { FormoArraySchema } from '../array/formo-array.schema';
import { FormoGroupSchema } from '../group/formo-group.schema';
import { FormoScalarOrArrayScalar } from '../shared/utils.interface';
import { IFormoRoot } from './formo-root.interface';

export interface FormoRootSchema<TValue extends Record<string, any>> {
  children: FormRootChildSchema<TValue>;
}

export type FormoRootFromSchema<T extends FormoRootSchema<any>> = IFormoRoot<
  T extends FormoRootSchema<infer U> ? U : never
>;

export type FormRootChildSchema<TValue extends Record<string, any>> = {
  [K in keyof TValue & string]: TValue[K] extends FormoScalarOrArrayScalar
    ? FormoFieldSchema<
        TValue[K],
        K extends string ? K : string,
        FormoRootSchema<TValue>
      >
    : TValue[K] extends Array<any>
    ? FormoArraySchema<
        TValue[K],
        K extends string ? K : string,
        FormoRootSchema<TValue>
      >
    : TValue[K] extends Record<string, any>
    ? FormoGroupSchema<
        TValue[K],
        K extends string ? K : string,
        FormoRootSchema<TValue>
      >
    : never;
};
