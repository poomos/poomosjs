import { FormoRootSchema } from '../root/formo-root.schema';
import { FormoRoot } from '../root/formo-root';

export const createFormFromSchema = <TValue extends Record<string, any>>(
  schema: FormoRootSchema<TValue>
): FormoRoot<TValue> => {
  return FormoRoot.toSchema(schema);
};
