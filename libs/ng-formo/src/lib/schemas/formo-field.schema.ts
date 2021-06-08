import { IFormoFieldConfig } from '../interfaces/config/formo-field-config';
import { FormoField } from '../models/formo-field';
import { FormoRootSchema } from './formo-root.schema';
import {
  FormoParentFromSchema,
  FormoParentSchema,
} from './formo-parent.schema';
import { FormoRootFromSchema } from './formo-root.schema';

export interface FormoFieldSchema<
  TValue,
  TRoot extends FormoRootSchema<any>,
  TKey extends string,
  TParent extends FormoParentSchema
> {
  config: IFormoFieldConfig<
    FormoField<
      TValue,
      FormoRootFromSchema<TRoot>,
      TKey,
      FormoParentFromSchema<TParent>
    >
  >;
  validation?: FormoField<
    TValue,
    FormoRootFromSchema<TRoot>,
    TKey,
    FormoParentFromSchema<TParent>
  >['validation'];
  listeners?: FormoField<
    TValue,
    FormoRootFromSchema<TRoot>,
    TKey,
    FormoParentFromSchema<TParent>
  >['listeners'];
}

export type FormoFieldFromSchema<
  TValue,
  TRoot extends FormoRootSchema<any>,
  TKey extends string,
  TParent extends FormoParentSchema
> = FormoField<
  TValue,
  FormoRootFromSchema<TRoot>,
  TKey,
  FormoParentFromSchema<TParent>
>;

export type FormoStringFieldSchema<
  TValue extends string,
  TRoot extends FormoRootSchema<any>,
  TKey extends string,
  TParent extends FormoParentSchema
> = FormoFieldSchema<TValue, TRoot, TKey, TParent>;

export type FormoBooleanFieldSchema<
  TValue extends boolean,
  TRoot extends FormoRootSchema<any>,
  TKey extends string,
  TParent extends FormoParentSchema
> = FormoFieldSchema<TValue, TRoot, TKey, TParent>;

export type FormoArrayFieldSchema<
  TValue extends Array<any>,
  TRoot extends FormoRootSchema<any>,
  TKey extends string,
  TParent extends FormoParentSchema
> = FormoFieldSchema<TValue, TRoot, TKey, TParent>;

export type FormoNumberFieldSchema<
  TValue extends number,
  TRoot extends FormoRootSchema<any>,
  TKey extends string,
  TParent extends FormoParentSchema
> = FormoFieldSchema<TValue, TRoot, TKey, TParent>;

export type FormoDateFieldSchema<
  TValue extends Date,
  TRoot extends FormoRootSchema<any>,
  TKey extends string,
  TParent extends FormoParentSchema
> = FormoFieldSchema<TValue, TRoot, TKey, TParent>;
