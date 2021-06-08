import { IFormoRootListeners } from '../interfaces/formo-root.interface';

import { FormoStringFieldSchema } from './formo-field.schema';
import { FormoBooleanFieldSchema } from './formo-field.schema';
import { FormoNumberFieldSchema } from './formo-field.schema';
import { FormoArrayFieldSchema } from './formo-field.schema';
import { FormoDateFieldSchema } from './formo-field.schema';
import { FormoArraySchema } from './formo-array.schema';
import { FormoGroupSchema } from './formo-group.schema';
import { FormoRoot } from '../models/formo-root';

export interface FormoRootSchema<TValue extends object> {
  children: FormRootChildSchema<TValue>;
  listeners?: IFormoRootListeners<TValue>;
}

export type FormoRootFromSchema<T extends FormoRootSchema<any>> = FormoRoot<
  T extends FormoRootSchema<infer U> ? U : never
>;

export type FormRootChildSchema<TValue extends object> = {
  [K in keyof TValue & string]: TValue[K] extends Date
    ? FormoDateFieldSchema<
        TValue[K],
        FormoRootSchema<TValue>,
        K extends string ? K : string,
        FormoRootSchema<TValue>
      >
    : TValue[K] extends string
    ? FormoStringFieldSchema<
        TValue[K],
        FormoRootSchema<TValue>,
        K extends string ? K : string,
        FormoRootSchema<TValue>
      >
    : TValue[K] extends boolean
    ? FormoBooleanFieldSchema<
        TValue[K],
        FormoRootSchema<TValue>,
        K extends string ? K : string,
        FormoRootSchema<TValue>
      >
    : TValue[K] extends number
    ? FormoNumberFieldSchema<
        TValue[K],
        FormoRootSchema<TValue>,
        K extends string ? K : string,
        FormoRootSchema<TValue>
      >
    : TValue[K] extends Array<any>
    ? TValue[K][0] extends string
      ? FormoArrayFieldSchema<
          TValue[K],
          FormoRootSchema<TValue>,
          K extends string ? K : string,
          FormoRootSchema<TValue>
        >
      : TValue[K][0] extends boolean
      ? FormoArrayFieldSchema<
          TValue[K],
          FormoRootSchema<TValue>,
          K extends string ? K : string,
          FormoRootSchema<TValue>
        >
      : TValue[K][0] extends number
      ? FormoArrayFieldSchema<
          TValue[K],
          FormoRootSchema<TValue>,
          K extends string ? K : string,
          FormoRootSchema<TValue>
        >
      : FormoArraySchema<
          TValue[K],
          FormoRootSchema<TValue>,
          K extends string ? K : string,
          FormoRootSchema<TValue>
        >
    : TValue[K] extends object
    ? FormoGroupSchema<
        TValue[K],
        FormoRootSchema<TValue>,
        K extends string ? K : string,
        FormoRootSchema<TValue>
      >
    : never;
};
