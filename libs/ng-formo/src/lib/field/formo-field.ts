import {
  FormArray,
  FormControl,
  ValidationErrors,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import * as _ from 'lodash';

import { FormoFieldTypes } from './formo-field.type';
import { FormoRoot } from '../root/formo-root';
import { FormoBaseWrapper } from '../base/formo-base-wrapper';
import { FormValidationError } from '../base/validation-error';
import { IFormoField, IFormoFieldConfig } from './formo-field.interface';
import { FormoScalarOrArrayScalar } from '../shared/utils.interface';
import { IFormoRoot } from '../root/formo-root.interface';
import {
  FormoRootFromSchema,
  FormoRootSchema,
} from '../root/formo-root.schema';
import { FormoFieldSchema } from './formo-field.schema';
import { IFormoArray } from '../array/formo-array.interface';
import { IFormoGroup } from '../group/formo-group.interface';

export class FormoField<
    TValue extends FormoScalarOrArrayScalar,
    TKey extends string,
    TRoot extends IFormoRoot<any>,
    TParent extends
      | IFormoArray<any, any, any, any>
      | IFormoRoot<any>
      | IFormoGroup<any, any, any, any>
  >
  extends FormoBaseWrapper<'control'>
  implements IFormoField<TValue, TKey, TRoot, TParent>
{
  initialControl: FormControl;
  arrayIndex: number;
  absolutePath: string;
  root: TRoot;
  parent: TParent;
  key: TKey;
  type = FormoFieldTypes.Text;
  panelClass = 'col-md-6';
  wrapperClass = '';
  isDisabled = false;
  multiple = false;
  defaultValue = null;
  label = '';
  help = '';
  hideLabel = false;
  compareKeyPath = null;
  placeholder = '';
  icon = null;
  choices = [];
  choiceLabel = null;
  choiceValue = null;
  description = '';
  labelPath = null;
  visible = true;
  isEmail: boolean = undefined;
  isRequired?: boolean = undefined;
  min?: number;
  max?: number;
  formValueChanged?: (root: TRoot, current: this) => void;
  onCustomEvent?: (event: string, value: unknown, current: this) => void;

  constructor(args: { key: TKey } & IFormoFieldConfig<TValue, TRoot>) {
    super();
    this.key = args.key;
    this.updateConfig(args);

    this.initialControl = new FormControl({
      value: this.defaultValue,
      disabled: this.isDisabled,
    });
  }

  static toSchema<
    TValue extends FormoScalarOrArrayScalar,
    TKey extends string,
    TRoot extends FormoRootSchema<any>
  >(
    key: TKey,
    schema: FormoFieldSchema<TValue, TKey, TRoot>
  ): IFormoField<TValue, TKey, FormoRootFromSchema<TRoot>, any> {
    return new FormoField<TValue, TKey, FormoRootFromSchema<TRoot>, any>({
      key,
      ...schema,
    });
  }

  updateConfig(config: IFormoFieldConfig<TValue, TRoot>) {
    for (const [key, value] of Object.entries(config)) {
      this[key] = value;
    }
    this.applyValidation();
  }

  get control(): FormControl {
    if (this.parent) {
      if (this.parent.control instanceof FormArray) {
        return (
          (this.parent.control.at(this.arrayIndex) as FormControl) ||
          this.initialControl
        );
      } else {
        return (
          (this.parent.control.get(this.key) as FormControl) ||
          this.initialControl
        );
      }
    } else {
      return this.initialControl;
    }
  }

  applyValidation() {
    if (this.control) {
      const validators: ValidatorFn[] = [];
      if (this.isRequired) {
        validators.push(Validators.required);
      }
      if (this.isEmail) {
        validators.push(Validators.email);
      }
      this.control.setValidators(validators);
    }
  }

  getLabel(value: any): any {
    if (this.labelPath) {
      return _.get(value, this.labelPath);
    }
    return value;
  }

  onGenerateForm(root: TRoot, parent: TParent) {
    this.root = root;
    this.parent = parent;
    if (this.parent.control instanceof FormArray) {
      this.parent.control.push(this.control);
    } else {
      this.parent.control.addControl(this.key, this.control);
    }
  }

  setRootAndParent(root: TRoot, parent: TParent) {
    this.parent = parent;
    this.root = root;
  }
  prepareForValue(value) {}

  get value(): TValue {
    return this.control.value;
  }

  setValue(
    value: TValue,
    options?: {
      onlySelf?: boolean;
      emitEvent?: boolean;
      emitModelToViewChange?: boolean;
      emitViewToModelChange?: boolean;
    }
  ) {
    this.control.setValue(value, options);
  }

  patchValue(value: Partial<TValue>) {
    this.control.patchValue(value);
  }

  getParent(): TParent {
    return this.parent;
  }

  validationErrors(): FormValidationError[] {
    const errors: FormValidationError[] = [];
    const controlErrors: ValidationErrors = this.control.errors;
    if (controlErrors !== null) {
      Object.keys(controlErrors).forEach((keyError) => {
        errors.push({
          key: this.key,
          error: keyError,
          value: this.control.value,
          formoType: 'field',
        });
      });
    }
    return errors;
  }

  dispatchRootChanged() {
    if (this.formValueChanged) {
      this.formValueChanged(this.root, this);
    }
  }
}

export class FormoStringField<
  TValue extends string,
  TRoot extends FormoRoot<any>,
  TKey extends string,
  TParent extends
    | IFormoArray<any, any, any, any>
    | IFormoRoot<any>
    | IFormoGroup<any, any, any, any>,
  TRootType = TRoot['_type']
> extends FormoField<TValue, TKey, TRoot, TParent> {}

export class FormoBooleanField<
  TValue extends boolean,
  TRoot extends FormoRoot<any>,
  TKey extends string,
  TParent extends
    | IFormoArray<any, any, any, any>
    | IFormoRoot<any>
    | IFormoGroup<any, any, any, any>,
  TRootType = TRoot['_type']
> extends FormoField<TValue, TKey, TRoot, TParent> {}

export class FormoArrayField<
  TValue extends Array<any>,
  TRoot extends FormoRoot<any>,
  TKey extends string,
  TParent extends
    | IFormoArray<any, any, any, any>
    | IFormoRoot<any>
    | IFormoGroup<any, any, any, any>,
  TRootType = TRoot['_type']
> extends FormoField<TValue, TKey, TRoot, TParent> {}

export class FormoNumberField<
  TValue extends number,
  TRoot extends FormoRoot<any>,
  TKey extends string,
  TParent extends
    | IFormoArray<any, any, any, any>
    | IFormoRoot<any>
    | IFormoGroup<any, any, any, any>,
  TRootType = TRoot['_type']
> extends FormoField<TValue, TKey, TRoot, TParent> {}

export class FormoDateField<
  TValue extends Date,
  TRoot extends FormoRoot<any>,
  TKey extends string,
  TParent extends
    | IFormoArray<any, any, any, any>
    | IFormoRoot<any>
    | IFormoGroup<any, any, any, any>,
  TRootType = TRoot['_type']
> extends FormoField<TValue, TKey, TRoot, TParent> {}
