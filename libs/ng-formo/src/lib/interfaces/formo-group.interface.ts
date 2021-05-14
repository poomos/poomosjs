import { FormoGroup } from '../models/formo-group';
import { FormoRoot } from '../models/formo-root';
import { IFormoParent } from './formo-parent.interface';
import {
  FormoArrayFieldType,
  FormoBooleanType,
  FormoDateType,
  FormoNumberType,
  FormoStringType
} from './formo-field.interface';
import { FormoArray } from '../models/formo-array';


export enum FormFieldGroupType {
  GoogleMapAutoComplete = 'google-map-autocomplete',
}
export type FormGroupChild<
  TValue extends object,
  TRoot extends FormoRoot<any>,
  TKey extends string,
  TParent extends IFormoParent
> = {
  [K in keyof TValue & string]: TValue[K] extends Date
    ? FormoDateType<
        TValue[K],
        TRoot,
        K extends string ? K : string,
        FormoGroup<TValue, TRoot, TKey, TParent>
      >
    : TValue[K] extends number
    ? FormoNumberType<
        TValue[K],
        TRoot,
        K extends string ? K : string,
        FormoGroup<TValue, TRoot, TKey, TParent>
      >
    : TValue[K] extends string
    ? FormoStringType<
        TValue[K],
        TRoot,
        K extends string ? K : string,
        FormoGroup<TValue, TRoot, TKey, TParent>
      >
    : TValue[K] extends boolean
    ? FormoBooleanType<
        TValue[K],
        TRoot,
        K extends string ? K : string,
        FormoGroup<TValue, TRoot, TKey, TParent>
      >
    : TValue[K] extends Array<any>
    ? TValue[K][0] extends string
      ? FormoArrayFieldType<
          TValue[K],
          TRoot,
          K extends string ? K : string,
          FormoRoot<TValue>
        >
      : TValue[K][0] extends boolean
      ? FormoArrayFieldType<
          TValue[K],
          TRoot,
          K extends string ? K : string,
          FormoRoot<TValue>
        >
      : TValue[K][0] extends number
      ? FormoArrayFieldType<
          TValue[K],
          TRoot,
          K extends string ? K : string,
          FormoRoot<TValue>
        >
      : FormoArray<
          TValue[K],
          TRoot,
          K extends string ? K : string,
          FormoRoot<TValue>
        >
    : TValue[K] extends object
    ? FormoGroup<TValue[K], TRoot, K extends string ? K : string, TParent>
    : never;
};
