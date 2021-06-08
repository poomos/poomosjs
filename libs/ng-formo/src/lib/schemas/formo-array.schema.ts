import { FormoRootFromSchema, FormoRootSchema } from './formo-root.schema';
import {
  FormoParentFromSchema,
  FormoParentSchema,
} from './formo-parent.schema';
import { FormoArray } from '../models/formo-array';
import { FormoGroupSchema } from './formo-group.schema';

export interface FormoArraySchema<
  TValue extends Array<any>,
  TRoot extends FormoRootSchema<any>,
  TKey extends string,
  TParent extends FormoParentSchema
> {
  model: FormoArrayModelSchema<TValue, TRoot, TKey, TParent>;
  config?: FormoArray<
    TValue,
    FormoRootFromSchema<TRoot>,
    TKey,
    FormoParentFromSchema<TParent>
  >['config'];
  listeners?: FormoArray<
    TValue,
    FormoRootFromSchema<TRoot>,
    TKey,
    FormoParentFromSchema<TParent>
  >['listeners'];
}

export type FormoArrayModelSchema<
  TValue extends Array<any>,
  TRoot extends FormoRootSchema<any>,
  TKey extends string,
  TParent extends FormoParentSchema
> = TValue[0] extends Array<any>
  ? FormoArraySchema<
      TValue[0],
      TRoot,
      string,
      FormoArraySchema<TValue, TRoot, TKey, TParent>
    >
  : TValue[0] extends object
  ? FormoGroupSchema<
      TValue[0],
      TRoot,
      string,
      FormoArraySchema<TValue, TRoot, TKey, TParent>
    >
  : never;
