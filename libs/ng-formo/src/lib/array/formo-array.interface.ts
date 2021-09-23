import { IFormoBaseWrapper } from '../base/formo-base.interface';
import { FormArray } from '@angular/forms';
import { IFormoRoot } from '../root/formo-root.interface';
import { IFormoGroup } from '../group/formo-group.interface';
import { FormValidationError } from '../base/validation-error';

export interface IFormoArrayConfig<
  TValue extends Array<any>,
  TRoot extends IFormoRoot<any>
> {
  visible?: boolean;
  label?: string;
  panelClass?: string;

  // Validation
  isRequired?: boolean;

  // Listener
  formValueChanged?: (root: TRoot, current: this) => void;
  onCustomEvent?: (event: string, value: unknown, current: this) => void;
}

export interface IFormoArray<
  TValue extends Array<any>,
  TKey extends string,
  TRoot extends IFormoRoot<any>,
  TParent extends IFormoRoot<any> | IFormoGroup<any, any, any, any>
> extends IFormoBaseWrapper<'array'>,
    IFormoArrayConfig<TValue, TRoot> {
  model: () => TValue[0] extends Record<string, any>
    ? IFormoGroup<TValue[0], string, TRoot, this>
    : never;
  children: ReturnType<this['model']>[];
  initialControl: FormArray;
  arrayIndex: number;
  root: TRoot;
  key: TKey;
  formValueChanged?: (root: TRoot, current: this) => void;
  onCustomEvent?: (event: string, value: unknown, current: this) => void;
  control: FormArray;
  setValue(
    value: TValue,
    options?: {
      onlySelf?: boolean;
      emitEvent?: boolean;
      emitModelToViewChange?: boolean;
      emitViewToModelChange?: boolean;
    }
  );
  prepareForValue(value: TValue);
  addModel(
    value?: TValue[0],
    options?: {
      onlySelf?: boolean;
      emitEvent?: boolean;
      emitModelToViewChange?: boolean;
      emitViewToModelChange?: boolean;
    }
  );
  removeAt(index: number);

  dispatchRootChanged();
  value: TValue;
  updateConfig(config: IFormoArrayConfig<TValue, TRoot>);
  validationErrors(): FormValidationError[];
  getChildByKey(key: number);
  parent: TParent;
  onGenerateForm(root: TRoot, parent: TParent);
  getChildByPath(key, nextPath: string[]);
  setRootAndParent(root: TRoot, parent: TParent);
}
