import { FormoGroupSchema } from '../group/formo-group.schema';
import { FormoRootSchema } from '../root/formo-root.schema';
import { FormoArraySchema } from '../array/formo-array.schema';
import { FormoObject } from './utils.interface';

export type FormoSchemaCanBeParent =
  | FormoGroupSchema<
      FormoObject,
      FormoRootSchema<any>,
      string,
      FormoSchemaCanBeParent
    >
  | FormoRootSchema<FormoObject>
  | FormoArraySchema<
      Array<any>,
      FormoRootSchema<any>,
      string,
      FormoSchemaCanBeParent
    >;
