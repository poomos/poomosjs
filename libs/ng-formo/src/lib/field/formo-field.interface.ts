import { FormoFieldTypes } from './formo-field.type';
import { IFormoBaseWrapper } from '../base/formo-base.interface';
import { IFormoRoot } from '../root/formo-root.interface';
import { FormoScalarOrArrayScalar } from '../shared/utils.interface';
import { FormControl } from '@angular/forms';
import { FormValidationError } from '../base/validation-error';
import { IFormoArray } from '../array/formo-array.interface';
import { IFormoGroup } from '../group/formo-group.interface';

export interface IFormoFieldConfig<TValue, TRoot extends IFormoRoot<any>> {
  type?: FormoFieldTypes | string;
  defaultValue: TValue;
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

  // Validation
  isEmail?: boolean;
  isRequired?: boolean;
  min?: number;
  max?: number;

  // Listener
  formValueChanged?: (root: TRoot, current: this) => void;
  onCustomEvent?: (event: string, value: any, current: this) => void;
}

export interface IFormoField<
  TValue extends FormoScalarOrArrayScalar,
  TKey extends string,
  TRoot extends IFormoRoot<any>,
  TParent extends
    | IFormoArray<any, any, any, any>
    | IFormoRoot<any>
    | IFormoGroup<any, any, any, any>
> extends IFormoBaseWrapper<'control'>,
    IFormoFieldConfig<TValue, TRoot> {
  initialControl: FormControl;
  arrayIndex: number;
  absolutePath: string;
  control: FormControl;
  setValue(
    value: TValue,
    options?: {
      onlySelf?: boolean;
      emitEvent?: boolean;
      emitModelToViewChange?: boolean;
      emitViewToModelChange?: boolean;
    }
  );
  root: TRoot;
  parent: TParent;
  key: TKey;
  value: TValue;
  updateConfig(config: IFormoFieldConfig<TValue, TRoot>);
  applyValidation();
  getLabel(value: any): any;
  onGenerateForm(root: TRoot, parent: TParent);
  setRootAndParent(root: TRoot, parent: TParent);
  prepareForValue(value);
  patchValue(value: Partial<TValue>);
  getParent(): TParent;
  validationErrors(): FormValidationError[];
  dispatchRootChanged();
}
