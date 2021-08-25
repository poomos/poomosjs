import { FormoField } from './formo-field';
import { FormoFieldTypes } from './formo-field.type';

export interface IFormoFieldConfig<
  TField extends FormoField<any, any, string, any>,
  T = TField['value']
> {
  type?: FormoFieldTypes | string;
  value: T;
  label?: string;
  hideLabel?: boolean;
  icon?: string;
  description?: string;
  help?: string;
  compareKeyPath?: string;
  choices?: any[];
  choiceLabel?: string;
  choiceValue?: string;
  placeholder?: string;
  labelPath?: string;
  isDisabled?: boolean;
  multiple?: boolean;
  panelClass?: string;
  wrapperClass?: string;
  visible?: boolean;
}
