import { FormoGroupSchema } from '../group/formo-group.schema';
import { FormoRootSchema } from '../root/formo-root.schema';
import { FormoArraySchema } from '../array/formo-array.schema';

export type FormoSchemaCanBeParent =
  | FormoGroupSchema<Record<string, any>, string, FormoRootSchema<any>>
  | FormoRootSchema<Record<string, any>>
  | FormoArraySchema<Array<any>, string, FormoRootSchema<any>>;
