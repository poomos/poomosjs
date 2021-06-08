import { FormoRootFromSchema, FormoRootSchema } from './formo-root.schema';
import {
  FormoParentFromSchema,
  FormoParentSchema,
} from './formo-parent.schema';
import { FormoGroup } from '../models/formo-group';
import { FormoRoot } from '../models/formo-root';
import {
  FormoArrayFieldSchema,
  FormoBooleanFieldSchema,
  FormoDateFieldSchema,
  FormoNumberFieldSchema,
  FormoStringFieldSchema,
} from './formo-field.schema';
import { FormoArraySchema } from './formo-array.schema';

export interface FormoGroupSchema<
  TValue extends object,
  TRoot extends FormoRootSchema<any>,
  TKey extends string,
  TParent extends FormoParentSchema
> {
  children: FormGroupChildSchema<TValue, TRoot, TKey, TParent>;
  config?: FormoGroup<
    TValue,
    FormoRootFromSchema<TRoot>,
    TKey,
    FormoParentFromSchema<TParent>
  >['config'];
  validation?: FormoGroup<
    TValue,
    FormoRootFromSchema<TRoot>,
    TKey,
    FormoParentFromSchema<TParent>
  >['validation'];
  listeners?: FormoGroup<
    TValue,
    FormoRootFromSchema<TRoot>,
    TKey,
    FormoParentFromSchema<TParent>
  >['listeners'];
}

export type FormGroupChildSchema<
  TValue extends object,
  TRoot extends FormoRootSchema<any>,
  TKey extends string,
  TParent extends FormoParentSchema
> = {
  [K in keyof TValue & string]: TValue[K] extends Date
    ? FormoDateFieldSchema<
        TValue[K],
        TRoot,
        K extends string ? K : string,
        FormoGroupSchema<TValue, TRoot, TKey, TParent>
      >
    : TValue[K] extends number
    ? FormoNumberFieldSchema<
        TValue[K],
        TRoot,
        K extends string ? K : string,
        FormoGroupSchema<TValue, TRoot, TKey, TParent>
      >
    : TValue[K] extends string
    ? FormoStringFieldSchema<
        TValue[K],
        TRoot,
        K extends string ? K : string,
        FormoGroupSchema<TValue, TRoot, TKey, TParent>
      >
    : TValue[K] extends boolean
    ? FormoBooleanFieldSchema<
        TValue[K],
        TRoot,
        K extends string ? K : string,
        FormoGroupSchema<TValue, TRoot, TKey, TParent>
      >
    : TValue[K] extends Array<any>
    ? TValue[K][0] extends string
      ? FormoArrayFieldSchema<
          TValue[K],
          TRoot,
          K extends string ? K : string,
          FormoRootSchema<TValue>
        >
      : TValue[K][0] extends boolean
      ? FormoArrayFieldSchema<
          TValue[K],
          TRoot,
          K extends string ? K : string,
          FormoRootSchema<TValue>
        >
      : TValue[K][0] extends number
      ? FormoArrayFieldSchema<
          TValue[K],
          TRoot,
          K extends string ? K : string,
          FormoRoot<TValue>
        >
      : FormoArraySchema<
          TValue[K],
          TRoot,
          K extends string ? K : string,
          FormoRoot<TValue>
        >
    : TValue[K] extends object
    ? FormoGroupSchema<TValue[K], TRoot, K extends string ? K : string, TParent>
    : never;
};
