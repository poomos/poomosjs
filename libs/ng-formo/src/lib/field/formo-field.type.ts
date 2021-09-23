import { FormoField } from './formo-field';
import { FormoRoot } from '../root/formo-root';
import { IFormoArray } from '../array/formo-array.interface';
import { IFormoRoot } from '../root/formo-root.interface';
import { IFormoGroup } from '../group/formo-group.interface';

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

export type FormoStringType<
  TValue extends string,
  TRoot extends FormoRoot<any>,
  TKey extends string,
  TParent extends
    | IFormoArray<any, any, any, any>
    | IFormoRoot<any>
    | IFormoGroup<any, any, any, any>
> = FormoField<TValue, TKey, TRoot, TParent>;

export type FormoDateType<
  TValue extends Date,
  TRoot extends FormoRoot<any>,
  TKey extends string,
  TParent extends
    | IFormoArray<any, any, any, any>
    | IFormoRoot<any>
    | IFormoGroup<any, any, any, any>
> = FormoField<TValue, TKey, TRoot, TParent>;

export type FormoArrayFieldType<
  TValue extends Array<any>,
  TRoot extends FormoRoot<any>,
  TKey extends string,
  TParent extends
    | IFormoArray<any, any, any, any>
    | IFormoRoot<any>
    | IFormoGroup<any, any, any, any>
> = FormoField<TValue, TKey, TRoot, TParent>;

export type FormoNumberType<
  TValue extends number,
  TRoot extends FormoRoot<any>,
  TKey extends string,
  TParent extends
    | IFormoArray<any, any, any, any>
    | IFormoRoot<any>
    | IFormoGroup<any, any, any, any>
> = FormoField<TValue, TKey, TRoot, TParent>;

export type FormoBooleanType<
  TValue extends boolean,
  TRoot extends FormoRoot<any>,
  TKey extends string,
  TParent extends
    | IFormoArray<any, any, any, any>
    | IFormoRoot<any>
    | IFormoGroup<any, any, any, any>
> = FormoField<TValue, TKey, TRoot, TParent>;
