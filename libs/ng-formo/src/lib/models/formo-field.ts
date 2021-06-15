import {
  FormArray,
  FormControl,
  ValidationErrors,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import * as _ from 'lodash';
import { IFormoFieldConfig } from '../interfaces/config/formo-field-config';
import {
  FormoFieldTypes,
  IFormoFieldListeners,
  IFormoFieldValidation,
} from '../interfaces/formo-field.interface';
import { IFormoFieldArgs } from '../interfaces/formo-field.interface';
import { FormoRoot } from './formo-root';
import { IFormoParent } from '../interfaces/formo-parent.interface';
import { FormValidationError } from '../interfaces/validation/validation-error';

export class FormoField<
  TValue,
  TRoot extends FormoRoot<any>,
  TKey extends string,
  TParent extends IFormoParent
> {
  initialControl: FormControl;
  arrayIndex: number;
  absolutePath: string;
  root: TRoot;
  parent: TParent;
  key: TKey;
  config: IFormoFieldConfig<FormoField<TValue, TRoot, TKey, TParent>> = {
    type: FormoFieldTypes.Text,
    panelClass: 'col-md-6',
    wrapperClass: '',
    isDisabled: false,
    multiple: false,
    value: null,
    label: '',
    help: '',
    hideLabel: false,
    compareKeyPath: null,
    placeholder: '',
    icon: null,
    choices: [],
    choiceLabel: null,
    choiceValue: null,
    description: '',
    labelPath: null,
    visible: true,
  };
  listeners: IFormoFieldListeners<
    TRoot,
    FormoField<TValue, TRoot, TKey, TParent>,
    TParent
  >;
  validation: IFormoFieldValidation<
    TRoot,
    FormoField<TValue, TRoot, TKey, TParent>
  >;

  constructor(args: IFormoFieldArgs<TValue, TRoot, TKey, TParent>) {
    this.key = args.key;
    this.updateConfig(args.config);
    this.listeners = args.listeners || {};
    this.setValidation(args.validation || {});
    this.initialControl = new FormControl({
      value: this.config.value,
      disabled: this.config.isDisabled,
    });
  }

  setValidation(
    validation: FormoField<TValue, TRoot, TKey, TParent>['validation']
  ) {
    this.validation = {};
    this.validation.isRequired =
      validation.isRequired === undefined ? false : validation.isRequired;
    this.validation.isEmail =
      validation.isEmail === undefined ? false : validation.isEmail;
    this.validation.min = validation.min || 0;
    this.validation.max = validation.max || 100000;
  }

  updateConfig(
    config: IFormoFieldConfig<FormoField<TValue, TRoot, TKey, TParent>>
  ) {
    this.config = {
      ...this.config,
      ...config,
    };
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
      if (this.validation.isRequired) {
        validators.push(Validators.required);
      }
      if (this.validation.isEmail) {
        validators.push(Validators.email);
      }
      this.control.setValidators(validators);
    }
  }

  getLabel(value: any): any {
    if (this.config.labelPath) {
      return _.get(value, this.config.labelPath);
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

  prepareForValue(value) {}

  get value(): TValue {
    return this.control.value;
  }

  setValue(
    value,
    options?: {
      onlySelf?: boolean;
      emitEvent?: boolean;
      emitModelToViewChange?: boolean;
      emitViewToModelChange?: boolean;
    }
  ) {
    this.control.setValue(value, options);
  }

  patchValue(value) {
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
    if (this.listeners.formValueChanged) {
      this.listeners.formValueChanged(this.root, this);
    }
  }
}

export class FormoStringField<
  TValue extends string,
  TRoot extends FormoRoot<any>,
  TKey extends string,
  TParent extends IFormoParent,
  TRootType = TRoot['_type']
> extends FormoField<TValue, TRoot, TKey, TParent> {}

export class FormoBooleanField<
  TValue extends boolean,
  TRoot extends FormoRoot<any>,
  TKey extends string,
  TParent extends IFormoParent,
  TRootType = TRoot['_type']
> extends FormoField<TValue, TRoot, TKey, TParent> {}

export class FormoArrayField<
  TValue extends Array<any>,
  TRoot extends FormoRoot<any>,
  TKey extends string,
  TParent extends IFormoParent,
  TRootType = TRoot['_type']
> extends FormoField<TValue, TRoot, TKey, TParent> {}

export class FormoNumberField<
  TValue extends number,
  TRoot extends FormoRoot<any>,
  TKey extends string,
  TParent extends IFormoParent,
  TRootType = TRoot['_type']
> extends FormoField<TValue, TRoot, TKey, TParent> {}

export class FormoDateField<
  TValue extends Date,
  TRoot extends FormoRoot<any>,
  TKey extends string,
  TParent extends IFormoParent,
  TRootType = TRoot['_type']
> extends FormoField<TValue, TRoot, TKey, TParent> {}
