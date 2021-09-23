import {
  FormoRootFromSchema,
  FormoRootSchema,
} from '../root/formo-root.schema';
import { FormoSchemaCanBeParent } from '../shared/formo-parent.schema';
import { FormoGroup } from './formo-group';
import { FormoFieldSchema } from '../field/formo-field.schema';
import { FormoArraySchema } from '../array/formo-array.schema';
import {
  FormoRequiredType,
  FormoScalarOrArrayScalar,
} from '../shared/utils.interface';
import { IFormoGroupConfig } from './formo-group.interface';

export const createFormGroupSchema = <
  TValue extends Record<string, any>,
  TRoot extends FormoRootSchema<any>,
  TKey extends string,
  TParent extends FormoSchemaCanBeParent
>(
  schema: FormoGroupSchema<FormoRequiredType<TValue>, TKey, TRoot>
): FormoGroupSchema<FormoRequiredType<TValue>, TKey, TRoot> => {
  return schema;
};

export type FormoGroupFromSchema<T extends FormoGroupSchema<any, any, any>> =
  T extends FormoGroupSchema<infer A, infer B, infer C>
    ? FormoGroup<A, B, FormoRootFromSchema<C>, any>
    : never;

export interface FormoGroupSchema<
  TValue extends Record<string, any>,
  TKey extends string,
  TRoot extends FormoRootSchema<any>
> extends IFormoGroupConfig<TValue, FormoRootFromSchema<TRoot>> {
  children: FormGroupChildSchema<TValue, TRoot, TKey>;
}

export type FormGroupChildSchema<
  TValue extends Record<string, any>,
  TRoot extends FormoRootSchema<any>,
  TKey extends string
> = {
  [K in keyof TValue & string]: TValue[K] extends FormoScalarOrArrayScalar
    ? FormoFieldSchema<TValue[K], K extends string ? K : string, TRoot>
    : TValue[K] extends Array<any>
    ? FormoArraySchema<TValue[K], K extends string ? K : string, TRoot>
    : TValue[K] extends Record<string, any>
    ? FormoGroupSchema<TValue[K], K extends string ? K : string, TRoot>
    : never;
};
