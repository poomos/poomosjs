import {
  FormArray,
  FormGroup,
  ValidationErrors,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import * as _ from 'lodash';
import { FormoBaseWrapper } from '../base/formo-base-wrapper';
import { FormValidationError } from '../base/validation-error';
import { IFormoGroup, IFormoGroupConfig } from './formo-group.interface';
import { FormoGroupSchema } from './formo-group.schema';
import {
  FormoRootFromSchema,
  FormoRootSchema,
} from '../root/formo-root.schema';
import { FormoArraySchema } from '../array/formo-array.schema';
import { FormoFieldSchema } from '../field/formo-field.schema';
import { FormoField } from '../field/formo-field';
import { FormoArray } from '../array/formo-array';
import { IFormoRoot } from '../root/formo-root.interface';
import { FormoRoot } from '../root/formo-root';

export class FormoGroup<
    TValue extends Record<string, any>,
    TKey extends string,
    TRoot extends IFormoRoot<any>,
    TParent extends
      | FormoRoot<any>
      | FormoArray<any, any, any, any>
      | FormoGroup<any, any, any, any>
  >
  extends FormoBaseWrapper<'group'>
  implements IFormoGroup<TValue, TKey, TRoot, TParent>
{
  label?: string;
  initialControl: FormGroup;
  arrayIndex: number;
  root: TRoot;
  parent: TParent;
  key: TKey;
  children;
  isRequired?: boolean = false;
  panelClass = 'col-md-6';
  visible = true;
  formValueChanged?: (root: TRoot, current: this) => void;
  onCustomEvent?: (event: string, value: unknown, current: this) => void;
  constructor(
    args: {
      key: TKey;
      children: IFormoGroup<TValue, TKey, TRoot, any>;
    } & IFormoGroupConfig<TValue, TRoot>
  ) {
    super();
    this.key = args.key;
    this.children = args.children;
    this.updateConfig(args);
    this.initialControl = new FormGroup({});
  }

  static toSchema<
    TValue extends Record<string, any>,
    TKey extends string,
    TRoot extends FormoRootSchema<any>
  >(
    key: TKey,
    schema: FormoGroupSchema<TValue, TKey, TRoot>
  ): IFormoGroup<TValue, TKey, FormoRootFromSchema<TRoot>, any> {
    const children: IFormoGroup<
      TValue,
      TKey,
      FormoRootFromSchema<TRoot>,
      any
    > = {} as IFormoGroup<TValue, TKey, FormoRootFromSchema<TRoot>, any>;
    for (const [key, value] of Object.entries(schema.children)) {
      if (schema.children[key]['model']) {
        children[key] = FormoArray.toSchema(
          key,
          schema.children[key] as FormoArraySchema<any, any, any>
        );
      } else {
        if (schema.children[key]['children']) {
          children[key] = FormoGroup.toSchema(
            key,
            schema.children[key] as FormoGroupSchema<any, any, any>
          );
        } else {
          children[key] = FormoField.toSchema(
            key,
            schema.children[key] as FormoFieldSchema<any, any, any>
          );
        }
      }
    }
    return new FormoGroup<TValue, TKey, FormoRootFromSchema<TRoot>, any>({
      key,
      children,
    });
  }
  prepareForValue(value) {
    Object.keys(this.children).forEach((key) => {
      this.children[key].prepareForValue(_.get(value, key));
    });
  }

  get control(): FormGroup {
    if (this.parent) {
      if (this.parent.control instanceof FormArray) {
        return (
          (this.parent.control.at(this.arrayIndex) as FormGroup) ||
          this.initialControl
        );
      } else {
        return (
          (this.parent.control.get(this.key) as FormGroup) ||
          this.initialControl
        );
      }
    } else {
      return this.initialControl;
    }
  }

  onGenerateForm(root: TRoot, parent: TParent) {
    this.root = root;
    this.parent = parent;

    if (this.parent.control instanceof FormArray) {
      this.parent.control.push(this.initialControl);
    } else {
      this.parent.control.addControl(this.key, this.initialControl);
    }
    Object.keys(this.children).forEach((key) => {
      this.children[key].onGenerateForm(this.root, this);
    });
  }

  getChildByPath(key: string) {
    return this.children[key];
  }

  getChildByIndex(index: number) {
    return this.children[Object.keys(this.children)[index]];
  }

  setRootAndParent(root: TRoot, parent: TParent) {
    this.parent = parent;
    this.root = root;
    Object.keys(this.children).forEach((key) => {
      return this.children[key].setRootAndParent(root, this);
    });
  }

  updateConfig(config: IFormoGroupConfig<TValue, TRoot>) {
    for (const [key, value] of Object.entries(config)) {
      this[key] = value;
    }
    this.applyValidation();
  }

  applyValidation() {
    if (this.control) {
      const validators: ValidatorFn[] = [];
      if (this.isRequired) {
        validators.push(Validators.required);
      }
      this.control.setValidators(validators);
    }
  }

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

  patchValue(value) {
    this.control.patchValue(value);
  }
  getChildByKey(key: string | number) {
    return this.children[key];
  }

  validationErrors(): FormValidationError[] {
    let errors: FormValidationError[] = [];
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
    Object.keys(this.children).forEach((key) => {
      errors = [...errors, ...this.children[key].validationErrors()];
    });
    return errors;
  }

  dispatchRootChanged() {
    if (this.formValueChanged) {
      this.formValueChanged(this.root, this);
    }
    Object.keys(this.children).forEach((key) => {
      this.children[key].dispatchRootChanged();
    });
  }
}
