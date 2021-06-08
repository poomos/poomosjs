import { FormoField } from '../models/formo-field';
import { FormoRoot } from '../models/formo-root';
import { IFormoParent } from './formo-parent.interface';
import { IFormoFieldConfig } from './config/formo-field-config';

export enum FormoFieldTypes {
  Text = 'text',
  PlaceAutoComplete = 'place_autocomplete',
  TextArea = 'text_area',
  Select = 'select',
  Switch = 'switch',
  Price = 'price',
  Number = 'number',
  Checkbox = 'checkbox',
  CheckboxTree = 'checkbox_tree',
  Hidden = 'checkbox',
  File = 'file',
  IconPicker = 'icon-picker',
  DatePicker = 'date-picker',
  MatChips = 'mat-chips',
  Radio = 'radio',
}

export interface IFormoFieldListeners<
  TRoot extends FormoRoot<any>,
  TCurrent extends FormoField<any, any, string, any>,
  TParent
> {
  formValueChanged?: (root: TRoot, current: TCurrent) => void;
  onCustomEvent?: (event: string, value: any, current: TCurrent) => void;
}

export interface IFormoFieldValidation<
  TRoot extends FormoRoot<any>,
  C extends FormoField<any, any, string, any>
> {
  isEmail?: boolean;
  isRequired?: boolean;
  min?: number;
  max?: number;
}

export type FormoStringType<
  TValue extends string,
  TRoot extends FormoRoot<any>,
  TKey extends string,
  TParent extends IFormoParent
> = FormoField<TValue, TRoot, TKey, TParent>;

export type FormoDateType<
  TValue extends Date,
  TRoot extends FormoRoot<any>,
  TKey extends string,
  TParent extends IFormoParent
> = FormoField<TValue, TRoot, TKey, TParent>;

export type FormoArrayFieldType<
  TValue extends Array<any>,
  TRoot extends FormoRoot<any>,
  TKey extends string,
  TParent extends IFormoParent
> = FormoField<TValue, TRoot, TKey, TParent>;

export type FormoNumberType<
  TValue extends number,
  TRoot extends FormoRoot<any>,
  TKey extends string,
  TParent extends IFormoParent
> = FormoField<TValue, TRoot, TKey, TParent>;

export type FormoBooleanType<
  TValue extends boolean,
  TRoot extends FormoRoot<any>,
  TKey extends string,
  TParent extends IFormoParent
> = FormoField<TValue, TRoot, TKey, TParent>;

export interface IFormoFieldArgs<
  TValue,
  TRoot extends FormoRoot<any>,
  TKey extends string,
  TParent extends IFormoParent
> {
  key: TKey;
  config: IFormoFieldConfig<FormoField<TValue, TRoot, TKey, TParent>>;
  validation?: FormoField<TValue, TRoot, TKey, TParent>['validation'];
  listeners?: FormoField<TValue, TRoot, TKey, TParent>['listeners'];
}
