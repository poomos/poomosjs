import * as mongoose from 'mongoose';

type RefType =
  | number
  | string
  | Buffer
  | undefined
  | mongoose.Types.ObjectId
  | mongoose.Types.Buffer
  | typeof mongoose.Schema.Types.Number
  | typeof mongoose.Schema.Types.String
  | typeof mongoose.Schema.Types.Buffer
  | typeof mongoose.Schema.Types.ObjectId;

export type RefDocument<
  R,
  T extends RefType =
    | (R extends { _id?: RefType }
        ? NonNullable<R['_id']>
        : mongoose.Types.ObjectId)
    | undefined
> = R | T;
