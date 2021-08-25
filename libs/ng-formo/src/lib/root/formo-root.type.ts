import { FormoRoot } from './formo-root';
import { FormoArray } from '../array/formo-array';
import { FormoGroup } from '../group/formo-group';
import {
  FormoObject,
  FormoScalarOrArrayScalar,
} from '../shared/utils.interface';
import { FormoField } from '../field/formo-field';

export type FormRootChild<TValue extends FormoObject> = {
  [K in keyof TValue & string]: TValue[K] extends FormoScalarOrArrayScalar
    ? FormoField<
        TValue[K],
        FormoRoot<TValue>,
        K extends string ? K : string,
        FormoRoot<TValue>
      >
    : TValue[K] extends Array<any>
    ? FormoArray<
        TValue[K],
        FormoRoot<TValue>,
        K extends string ? K : string,
        FormoRoot<TValue>
      >
    : TValue[K] extends FormoObject
    ? FormoGroup<
        TValue[K],
        FormoRoot<TValue>,
        K extends string ? K : string,
        FormoRoot<TValue>
      >
    : never;
};

export interface IFormoRootListeners<TValue extends FormoObject> {
  formValueChanged?: (root: FormoRoot<TValue>) => void;
}

export interface IFormoRootArgs<TValue extends FormoObject> {
  children: FormRootChild<TValue>;
  listeners?: IFormoRootListeners<TValue>;
}
