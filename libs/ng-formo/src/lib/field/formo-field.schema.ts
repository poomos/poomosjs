import { FormoField } from './formo-field';
import {
  FormoRootFromSchema,
  FormoRootSchema,
} from '../root/formo-root.schema';
import { FormoSchemaCanBeParent } from '../shared/formo-parent.schema';
import { IFormoFieldConfig } from './formo-field.interface';
import { FormoScalarOrArrayScalar } from '../shared/utils.interface';

export type FormoFieldFromSchema<T extends FormoFieldSchema<any, any, any>> =
  T extends FormoFieldSchema<infer A, infer B, infer C>
    ? FormoField<A, B, FormoRootFromSchema<C>, any>
    : never;

export type FormoFieldSchema<
  TValue extends FormoScalarOrArrayScalar,
  TKey extends string,
  TRoot extends FormoRootSchema<any>
> = IFormoFieldConfig<TValue, FormoRootFromSchema<TRoot>>;

export type FormoStringFieldSchema<
  TValue extends string,
  TKey extends string,
  TRoot extends FormoRootSchema<any>,
  TParent extends FormoSchemaCanBeParent
> = FormoFieldSchema<TValue, TKey, TRoot>;

export type FormoBooleanFieldSchema<
  TValue extends boolean,
  TRoot extends FormoRootSchema<any>,
  TKey extends string,
  TParent extends FormoSchemaCanBeParent
> = FormoFieldSchema<TValue, TKey, TRoot>;

export type FormoArrayFieldSchema<
  TValue extends Array<any>,
  TRoot extends FormoRootSchema<any>,
  TKey extends string,
  TParent extends FormoSchemaCanBeParent
> = FormoFieldSchema<TValue, TKey, TRoot>;

export type FormoNumberFieldSchema<
  TValue extends number,
  TRoot extends FormoRootSchema<any>,
  TKey extends string,
  TParent extends FormoSchemaCanBeParent
> = FormoFieldSchema<TValue, TKey, TRoot>;

export type FormoDateFieldSchema<
  TValue extends Date,
  TRoot extends FormoRootSchema<any>,
  TKey extends string,
  TParent extends FormoSchemaCanBeParent
> = FormoFieldSchema<TValue, TKey, TRoot>;
