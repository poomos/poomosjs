import { FormoGroup } from './formo-group';
import { FormoRoot } from '../root/formo-root';
import { FormoArray } from '../array/formo-array';
import { FormoCanBeParent } from '../base/formo-base-wrapper';
import {
  FormoObject,
  FormoScalarOrArrayScalar,
} from '../shared/utils.interface';
import { FormoField } from '../field/formo-field';

export enum FormFieldGroupType {
  GoogleMapAutoComplete = 'google-map-autocomplete',
}
export type FormGroupChild<
  TValue extends FormoObject,
  TRoot extends FormoRoot<any>,
  TKey extends string,
  TParent extends FormoCanBeParent
> = {
  [K in keyof TValue & string]: TValue[K] extends FormoScalarOrArrayScalar
    ? FormoField<
        TValue[K],
        TRoot,
        K extends string ? K : string,
        FormoGroup<TValue, TRoot, TKey, TParent>
      >
    : TValue[K] extends Array<any>
    ? FormoArray<
        TValue[K],
        TRoot,
        K extends string ? K : string,
        FormoGroup<TValue, TRoot, TKey, TParent>
      >
    : TValue[K] extends FormoObject
    ? FormoGroup<
        TValue[K],
        TRoot,
        K extends string ? K : string,
        FormoGroup<TValue, TRoot, TKey, TParent>
      >
    : never;
};

export interface IFormoGroupArgs<
  TValue extends FormoObject,
  TRoot extends FormoRoot<any>,
  TKey extends string,
  TParent extends FormoCanBeParent
> {
  key: TKey;
  children: FormGroupChild<TValue, TRoot, TKey, TParent>;
  config: FormoGroup<TValue, TRoot, TKey, TParent>['config'];
  validation: FormoGroup<TValue, TRoot, TKey, TParent>['validation'];
  listeners: FormoGroup<TValue, TRoot, TKey, TParent>['listeners'];
}
