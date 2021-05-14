import {
  FormoArrayFieldType,
  FormoBooleanType,
  FormoDateType,
  FormoNumberType,
  FormoStringType
} from './formo-field.interface';
import { FormoRoot } from '../models/formo-root';
import { FormoArray } from '../models/formo-array';
import { FormoGroup } from '../models/formo-group';

export type FormRootChild<TValue extends object> = {
  [K in keyof TValue & string]: TValue[K] extends Date
    ? FormoDateType<
        TValue[K],
        FormoRoot<TValue>,
        K extends string ? K : string,
        FormoRoot<TValue>
      >
    : TValue[K] extends string
    ? FormoStringType<
        TValue[K],
        FormoRoot<TValue>,
        K extends string ? K : string,
        FormoRoot<TValue>
      >
    : TValue[K] extends boolean
    ? FormoBooleanType<
        TValue[K],
        FormoRoot<TValue>,
        K extends string ? K : string,
        FormoRoot<TValue>
      >
    : TValue[K] extends number
    ? FormoNumberType<
        TValue[K],
        FormoRoot<TValue>,
        K extends string ? K : string,
        FormoRoot<TValue>
      >
    : TValue[K] extends Array<any>
    ? TValue[K][0] extends string
      ? FormoArrayFieldType<
          TValue[K],
          FormoRoot<TValue>,
          K extends string ? K : string,
          FormoRoot<TValue>
        >
      : TValue[K][0] extends boolean
      ? FormoArrayFieldType<
          TValue[K],
          FormoRoot<TValue>,
          K extends string ? K : string,
          FormoRoot<TValue>
        >
      : TValue[K][0] extends number
      ? FormoArrayFieldType<
          TValue[K],
          FormoRoot<TValue>,
          K extends string ? K : string,
          FormoRoot<TValue>
        >
      : FormoArray<
          TValue[K],
          FormoRoot<TValue>,
          K extends string ? K : string,
          FormoRoot<TValue>
        >
    : TValue[K] extends object
    ? FormoGroup<
        TValue[K],
        FormoRoot<TValue>,
        K extends string ? K : string,
        FormoRoot<TValue>
      >
    : never;
};

export interface IFormoRootListeners<TValue extends object> {
  formValueChanged?: (root: FormoRoot<TValue>) => void;
}
