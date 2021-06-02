import { FormoArray } from '../models/formo-array';
import { FormoRoot } from '../models/formo-root';
import { FormoGroup } from '../models/formo-group';
import { IFormoParent } from './formo-parent.interface';

export type FormoArrayModel<
  TValue extends Array<any>,
  TRoot extends FormoRoot<any>,
  TKey extends string,
  TParent extends IFormoParent
> = () => TValue[0] extends Array<any>
  ? FormoArray<
      TValue[0],
      TRoot,
      string,
      FormoArray<TValue, TRoot, TKey, TParent>
    >
  : TValue[0] extends object
  ? FormoGroup<
      TValue[0],
      TRoot,
      string,
      FormoArray<TValue, TRoot, TKey, TParent>
    >
  : never;

export type FormoArrayChildren<
  TValue extends Array<any>,
  TRoot extends FormoRoot<any>,
  TKey extends string,
  TParent extends IFormoParent
> = ReturnType<FormoArrayModel<TValue, TRoot, TKey, TParent>>[];

export interface IFormoArrayConfig<
  TRoot extends FormoRoot<any>,
  TCurrent extends FormoArray<any, any, string, any>
> {
  visible?: boolean;
}

export interface IFormoArrayListeners<
  TRoot extends FormoRoot<any>,
  TCurrent extends FormoArray<any, any, string, any>,
  TParent
> {
  formValueChanged?: (root: TRoot, current: TCurrent) => void;
}