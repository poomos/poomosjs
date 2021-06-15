import * as mongoose from 'mongoose';

export function extendSchema(
  schema: mongoose.Schema,
  definition,
  options = null
) {
  return new mongoose.Schema(
    Object.assign({}, schema.obj, definition),
    options
  );
}

