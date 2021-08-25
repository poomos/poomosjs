import { FormoFieldSchema } from '../field/formo-field.schema';
import { FormoArraySchema } from '../array/formo-array.schema';
import { FormoGroupSchema } from '../group/formo-group.schema';
import { FormoRoot } from './formo-root';
import { IFormoRootListeners } from './formo-root.type';
import {
  FormoObject,
  FormoScalarOrArrayScalar,
} from '../shared/utils.interface';

export interface FormoRootSchema<TValue extends FormoObject> {
  children: FormRootChildSchema<TValue>;
  listeners?: IFormoRootListeners<TValue>;
}

export type FormoRootFromSchema<T extends FormoRootSchema<any>> = FormoRoot<
  T extends FormoRootSchema<infer U> ? U : never
>;

export type FormRootChildSchema<TValue extends FormoObject> = {
  [K in keyof TValue & string]: TValue[K] extends FormoScalarOrArrayScalar
    ? FormoFieldSchema<
        TValue[K],
        FormoRootSchema<TValue>,
        K extends string ? K : string,
        FormoRootSchema<TValue>
      >
    : TValue[K] extends Array<any>
    ? FormoArraySchema<
        TValue[K],
        FormoRootSchema<TValue>,
        K extends string ? K : string,
        FormoRootSchema<TValue>
      >
    : TValue[K] extends FormoObject
    ? FormoGroupSchema<
        TValue[K],
        FormoRootSchema<TValue>,
        K extends string ? K : string,
        FormoRootSchema<TValue>
      >
    : never;
};
