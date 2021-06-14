import { FormoField } from '../../models/formo-field';
import { FormoFieldTypes } from '../formo-field.interface';

export interface IFormoFieldConfig<
  TField extends FormoField<any, any, string, any>,
  T = ReturnType<TField['value']>
> {
  type?: FormoFieldTypes | string;
  value: T;
  label?: string;
  hideLabel?: boolean;
  icon?: string;
  description?: string;
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
