import { FormArray, FormGroup, ValidationErrors } from '@angular/forms';
import * as _ from 'lodash';

import { FormoRoot } from '../root/formo-root';
import {
  FormoBaseWrapper,
  FormoCanBeParent,
  IFormoBaseChild,
} from '../base/formo-base-wrapper';
import { FormGroupChild, IFormoGroupArgs } from './formo-group.type';
import { FormValidationError } from '../base/validation-error';
import {
  FormoGroupConfig,
  IFormoGroupConfig,
  IFormoGroupListeners,
  IFormoGroupValidation,
} from './formo-group-config';
import { FormoObject } from '../shared/utils.interface';

export class FormoGroup<
    TValue extends FormoObject,
    TRoot extends FormoRoot<any>,
    TKey extends string,
    TParent extends FormoCanBeParent
  >
  extends FormoBaseWrapper
  implements IFormoBaseChild<TRoot, TParent>
{
  initialControl: FormGroup;
  arrayIndex: number;
  root: TRoot;
  parent: TParent;
  key: TKey;
  children: FormGroupChild<TValue, TRoot, TKey, TParent>;
  config: IFormoGroupConfig<TRoot, FormoGroup<TValue, TRoot, TKey, TParent>>;
  validation: IFormoGroupValidation<
    TRoot,
    FormoGroup<TValue, TRoot, TKey, TParent>
  >;
  listeners: IFormoGroupListeners<
    TRoot,
    FormoGroup<TValue, TRoot, TKey, TParent>,
    TParent
  >;

  constructor(args: IFormoGroupArgs<TValue, TRoot, TKey, TParent>) {
    super();
    this.key = args.key;
    this.children = args.children;
    this.setConfig(args.config || {});
    this.listeners = args.listeners || {};
    this.setValidation(args.validation || {});
    this.initialControl = new FormGroup({});
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

  setConfig(config: FormoGroup<TValue, TRoot, TKey, TParent>['config']) {
    this.config = new FormoGroupConfig(config);
  }

  setValidation(
    validation: FormoGroup<TValue, TRoot, TKey, TParent>['validation']
  ) {
    this.validation = {
      isRequired: validation.isRequired || false,
    };
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
    if (this.listeners.formValueChanged) {
      this.listeners.formValueChanged(this.root, this);
    }
    Object.keys(this.children).forEach((key) => {
      this.children[key].dispatchRootChanged();
    });
  }
}
