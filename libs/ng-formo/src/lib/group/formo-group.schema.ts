import {
  FormoRootFromSchema,
  FormoRootSchema,
} from '../root/formo-root.schema';
import { FormoSchemaCanBeParent } from '../shared/formo-parent.schema';
import { FormoGroup } from './formo-group';
import { FormoFieldSchema } from '../field/formo-field.schema';
import { FormoArraySchema } from '../array/formo-array.schema';
import {
  FormoObject,
  FormoRequiredType,
  FormoScalarOrArrayScalar,
} from '../shared/utils.interface';
import { FormSchema } from '../base/schema';

export const createFormGroupSchema = <
  TValue extends FormoObject,
  TRoot extends FormoRootSchema<any>,
  TKey extends string,
  TParent extends FormoSchemaCanBeParent
>(
  schema: FormoGroupSchema<FormoRequiredType<TValue>, TRoot, TKey, TParent>
): FormoGroupSchema<FormoRequiredType<TValue>, TRoot, TKey, TParent> => {
  return schema;
};

export type FormoGroupFromSchema<
  T extends FormoGroupSchema<any, any, any, any>
> = T extends FormoGroupSchema<infer A, infer B, infer C, infer D>
  ? FormoGroup<A, FormoRootFromSchema<B>, C, any>
  : never;

export interface FormoGroupSchema<
  TValue extends FormoObject,
  TRoot extends FormoRootSchema<any>,
  TKey extends string,
  TParent extends FormoSchemaCanBeParent
> {
  children: FormGroupChildSchema<TValue, TRoot, TKey, TParent>;
  config?: FormoGroup<TValue, FormoRootFromSchema<TRoot>, TKey, any>['config'];
  validation?: FormoGroup<
    TValue,
    FormoRootFromSchema<TRoot>,
    TKey,
    any
  >['validation'];
  listeners?: FormoGroup<
    TValue,
    FormoRootFromSchema<TRoot>,
    TKey,
    any
  >['listeners'];
}

export type FormGroupChildSchema<
  TValue extends FormoObject,
  TRoot extends FormoRootSchema<any>,
  TKey extends string,
  TParent extends FormoSchemaCanBeParent
> = {
  [K in keyof TValue & string]: TValue[K] extends FormoScalarOrArrayScalar
    ? FormoFieldSchema<
        TValue[K],
        TRoot,
        K extends string ? K : string,
        FormoGroupSchema<TValue, TRoot, TKey, TParent>
      >
    : TValue[K] extends Array<any>
    ? FormoArraySchema<
        TValue[K],
        TRoot,
        K extends string ? K : string,
        FormoGroupSchema<TValue, TRoot, TKey, TParent>
      >
    : TValue[K] extends FormoObject
    ? FormoGroupSchema<
        TValue[K],
        TRoot,
        K extends string ? K : string,
        FormoGroupSchema<TValue, TRoot, TKey, TParent>
      >
    : never;
};
