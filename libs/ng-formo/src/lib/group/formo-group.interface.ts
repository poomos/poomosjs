import { IFormoBaseWrapper } from '../base/formo-base.interface';
import { FormGroup } from '@angular/forms';
import { FormValidationError } from '../base/validation-error';
import { IFormoRoot } from '../root/formo-root.interface';
import { FormoScalarOrArrayScalar } from '../shared/utils.interface';
import { IFormoArray } from '../array/formo-array.interface';
import { IFormoField } from '../field/formo-field.interface';

export enum FormoGroupTypes {
  Classic = 'Classic',
  DateRange = 'DateRange',
}

export interface IFormoGroupConfig<
  TValue extends Record<string, any>,
  TRoot extends IFormoRoot<any>
> {
  type?: FormoGroupTypes | string;
  defaultValue?: TValue;
  visible?: boolean;
  label?: string;
  panelClass?: string;

  // Validation
  isRequired?: boolean;

  // Listener
  formValueChanged?: (root: TRoot, current: this) => void;
  onCustomEvent?: (event: string, value: unknown, current: this) => void;
}

export interface IFormoGroup<
  TValue extends Record<string, any>,
  TKey extends string,
  TRoot extends IFormoRoot<any>,
  TParent extends
    | IFormoArray<any, any, any, any>
    | IFormoRoot<any>
    | IFormoGroup<any, any, any, any>
> extends IFormoBaseWrapper<'group'>,
    IFormoGroupConfig<TValue, TRoot> {
  initialControl: FormGroup;
  arrayIndex: number;
  root: TRoot;
  parent: TParent;
  key: TKey;

  children: {
    [K in keyof TValue & string]: TValue[K] extends FormoScalarOrArrayScalar
      ? IFormoField<TValue[K], K extends string ? K : string, TRoot, this>
      : TValue[K] extends Array<any>
      ? IFormoArray<TValue[K], K extends string ? K : string, TRoot, this>
      : TValue[K] extends Record<string, any>
      ? IFormoGroup<TValue[K], K extends string ? K : string, TRoot, this>
      : never;
  };
  prepareForValue(value);

  control: FormGroup;

  onGenerateForm(root: TRoot, parent: TParent);
  getChildByPath(key: string);

  getChildByIndex(index: number);

  setRootAndParent(root: TRoot, parent: TParent);

  updateConfig(config: IFormoGroupConfig<TValue, TRoot>);

  applyValidation();

  get value(): TValue;
  setValue(
    value: TValue,
    options?: {
      onlySelf?: boolean;
      emitEvent?: boolean;
      emitModelToViewChange?: boolean;
      emitViewToModelChange?: boolean;
    }
  );
  patchValue(value);
  getChildByKey(key: string | number);

  validationErrors(): FormValidationError[];

  dispatchRootChanged();
}
