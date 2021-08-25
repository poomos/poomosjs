import { FormoField } from './formo-field';
import {
  FormoRootFromSchema,
  FormoRootSchema,
} from '../root/formo-root.schema';
import { FormoSchemaCanBeParent } from '../shared/formo-parent.schema';
import { IFormoFieldConfig } from './formo-field-config';
import { FormoScalarOrArrayScalar } from '../shared/utils.interface';

export type FormoFieldFromSchema<
  T extends FormoFieldSchema<any, any, any, any>
> = T extends FormoFieldSchema<infer A, infer B, infer C, infer D>
  ? FormoField<A, FormoRootFromSchema<B>, C, any>
  : never;

export interface FormoFieldSchema<
  TValue extends FormoScalarOrArrayScalar,
  TRoot extends FormoRootSchema<any>,
  TKey extends string,
  TParent extends FormoSchemaCanBeParent
> {
  config: IFormoFieldConfig<
    FormoField<TValue, FormoRootFromSchema<TRoot>, TKey, any>
  >;
  validation?: FormoField<
    TValue,
    FormoRootFromSchema<TRoot>,
    TKey,
    any
  >['validation'];
  listeners?: FormoField<
    TValue,
    FormoRootFromSchema<TRoot>,
    TKey,
    any
  >['listeners'];
}

export type FormoStringFieldSchema<
  TValue extends string,
  TRoot extends FormoRootSchema<any>,
  TKey extends string,
  TParent extends FormoSchemaCanBeParent
> = FormoFieldSchema<TValue, TRoot, TKey, TParent>;

export type FormoBooleanFieldSchema<
  TValue extends boolean,
  TRoot extends FormoRootSchema<any>,
  TKey extends string,
  TParent extends FormoSchemaCanBeParent
> = FormoFieldSchema<TValue, TRoot, TKey, TParent>;

export type FormoArrayFieldSchema<
  TValue extends Array<any>,
  TRoot extends FormoRootSchema<any>,
  TKey extends string,
  TParent extends FormoSchemaCanBeParent
> = FormoFieldSchema<TValue, TRoot, TKey, TParent>;

export type FormoNumberFieldSchema<
  TValue extends number,
  TRoot extends FormoRootSchema<any>,
  TKey extends string,
  TParent extends FormoSchemaCanBeParent
> = FormoFieldSchema<TValue, TRoot, TKey, TParent>;

export type FormoDateFieldSchema<
  TValue extends Date,
  TRoot extends FormoRootSchema<any>,
  TKey extends string,
  TParent extends FormoSchemaCanBeParent
> = FormoFieldSchema<TValue, TRoot, TKey, TParent>;
