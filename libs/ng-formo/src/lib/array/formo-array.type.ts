import { FormoArray } from './formo-array';
import { FormoRoot } from '../root/formo-root';
import { FormoGroup } from '../group/formo-group';
import { FormoCanBeParent } from '../base/formo-base-wrapper';
import { FormoObject } from '../shared/utils.interface';

export type FormoArrayModel<
  TValue extends Array<any>,
  TRoot extends FormoRoot<any>,
  TKey extends string,
  TParent extends FormoCanBeParent
> = () => TValue[0] extends Array<any>
  ? FormoArray<
      TValue[0],
      TRoot,
      string,
      FormoArray<TValue, TRoot, TKey, TParent>
    >
  : TValue[0] extends FormoObject
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
  TParent extends FormoCanBeParent
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

export interface IFormoArrayArgs<
  TValue extends Array<any>,
  TRoot extends FormoRoot<any>,
  TKey extends string,
  TParent extends FormoCanBeParent
> {
  key: TKey;
  model: FormoArrayModel<TValue, TRoot, TKey, TParent>;
  config: FormoArray<TValue, TRoot, TKey, TParent>['config'];
  listeners: FormoArray<TValue, TRoot, TKey, TParent>['listeners'];
}
