import {
  FormoRootFromSchema,
  FormoRootSchema,
} from '../root/formo-root.schema';
import { FormoGroupSchema } from '../group/formo-group.schema';
import { IFormoArray } from './formo-array.interface';

export type FormoArrayFromSchema<T extends FormoArraySchema<any, any, any>> =
  T extends FormoArraySchema<infer A, infer B, infer C>
    ? IFormoArray<A, B, FormoRootFromSchema<C>, any>
    : never;

export interface FormoArraySchema<
  TValue extends Array<any>,
  TKey extends string,
  TRoot extends FormoRootSchema<any>
> {
  model: FormoArrayModelSchema<TValue, TKey, TRoot>;
}

export type FormoArrayModelSchema<
  TValue extends Array<any>,
  TKey extends string,
  TRoot extends FormoRootSchema<any>
> = TValue[0] extends Record<string, any>
  ? FormoGroupSchema<TValue[0], string, TRoot>
  : never;
