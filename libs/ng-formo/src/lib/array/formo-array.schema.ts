import {
  FormoRootFromSchema,
  FormoRootSchema,
} from '../root/formo-root.schema';

import { FormoArray } from './formo-array';
import { FormoGroupSchema } from '../group/formo-group.schema';
import { FormoSchemaCanBeParent } from '../shared/formo-parent.schema';
import { FormoObject } from '../shared/utils.interface';

export type FormoArrayFromSchema<
  T extends FormoArraySchema<any, any, any, any>
> = T extends FormoArraySchema<infer A, infer B, infer C, infer D>
  ? FormoArray<A, FormoRootFromSchema<B>, C, any>
  : never;

export interface FormoArraySchema<
  TValue extends Array<any>,
  TRoot extends FormoRootSchema<any>,
  TKey extends string,
  TParent extends FormoSchemaCanBeParent
> {
  model: FormoArrayModelSchema<TValue, TRoot, TKey, TParent>;
  config?: FormoArray<TValue, FormoRootFromSchema<TRoot>, TKey, any>['config'];
  listeners?: FormoArray<
    TValue,
    FormoRootFromSchema<TRoot>,
    TKey,
    any
  >['listeners'];
}

export type FormoArrayModelSchema<
  TValue extends Array<any>,
  TRoot extends FormoRootSchema<any>,
  TKey extends string,
  TParent extends FormoSchemaCanBeParent
> = TValue[0] extends Array<any>
  ? FormoArraySchema<
      TValue[0],
      TRoot,
      string,
      FormoArraySchema<TValue, TRoot, TKey, TParent>
    >
  : TValue[0] extends FormoObject
  ? FormoGroupSchema<
      TValue[0],
      TRoot,
      string,
      FormoArraySchema<TValue, TRoot, TKey, TParent>
    >
  : never;
