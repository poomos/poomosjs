import { FormArray, ValidationErrors } from '@angular/forms';

import {
  FormoBaseWrapper,
  FormoCanBeParent,
  IFormoBaseChild,
} from '../base/formo-base-wrapper';
import {
  FormoArrayChildren,
  FormoArrayModel,
  IFormoArrayArgs,
  IFormoArrayConfig,
  IFormoArrayListeners,
} from './formo-array.type';
import { FormValidationError } from '../base/validation-error';
import { FormoRoot } from '../root/formo-root';

export class FormoArray<
    TValue extends Array<any>,
    TRoot extends FormoRoot<any>,
    TKey extends string,
    TParent extends FormoCanBeParent
  >
  extends FormoBaseWrapper
  implements IFormoBaseChild<TRoot, TParent>
{
  initialControl: FormArray;
  arrayIndex: number;
  root: TRoot;
  parent: TParent;
  key: TKey;
  model: FormoArrayModel<TValue, TRoot, TKey, TParent>;
  children: FormoArrayChildren<TValue, TRoot, TKey, TParent>;
  config: IFormoArrayConfig<TRoot, FormoArray<TValue, TRoot, TKey, TParent>>;
  listeners: IFormoArrayListeners<
    TRoot,
    FormoArray<TValue, TRoot, TKey, TParent>,
    TParent
  >;

  constructor(args: IFormoArrayArgs<TValue, TRoot, TKey, TParent>) {
    super();
    this.key = args.key;
    this.model = args.model;
    this.children = [];
    this.setConfig(args.config || {});
    this.listeners = args.listeners || {};
    this.initialControl = new FormArray([]);
  }

  get control(): FormArray {
    if (this.parent) {
      if (this.parent.control instanceof FormArray) {
        return (
          (this.parent.control.at(this.arrayIndex) as FormArray) ||
          this.initialControl
        );
      } else {
        return (
          (this.parent.control.get(this.key) as FormArray) ||
          this.initialControl
        );
      }
    } else {
      return this.initialControl;
    }
  }
  onGenerateForm(root: TRoot, parent: TParent) {
    this.parent = parent;
    this.root = root;
    if (this.parent.control instanceof FormArray) {
      this.parent.control.push(this.initialControl);
    } else {
      this.parent.control.addControl(this.key, this.initialControl);
    }
    for (let i = 0; i < this.children.length; i++) {
      this.children[i].onGenerateForm(this.root, this);
    }
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
    this.removeAllChildren();
    for (let i = 0; i < value.length; i++) {
      this.addModel();
    }
    for (let i = 0; i < this.children.length; i++) {
      const hgb = this.children[i];
      const uyg = value[i];
      this.children[i].prepareForValue(value[i]);
    }
    this.control.setValue(value, options);
  }

  prepareForValue(value: TValue) {
    this.removeAllChildren();
    if (value && Array.isArray(value)) {
      for (let i = 0; i < value.length; i++) {
        this.addModel();
      }
      for (let i = 0; i < this.children.length; i++) {
        this.children[i].prepareForValue(value[i]);
      }
    }
  }

  addModel(
    value?: TValue[0],
    options?: {
      onlySelf?: boolean;
      emitEvent?: boolean;
      emitModelToViewChange?: boolean;
      emitViewToModelChange?: boolean;
    }
  ) {
    const clone = this.model();
    clone.arrayIndex = this.children.length;
    this.children.push(clone);
    clone.onGenerateForm(this.root, this);
    const v = value;
    if (value) {
      clone.control.setValue(value, options);
    }
  }

  removeAt(index: number) {
    this.control.removeAt(index);
    this.children = this.children.filter((v, i) => i !== index);
  }

  removeAllChildren() {
    while (this.control.length !== 0) {
      this.control.removeAt(0);
    }
    this.children = [];
  }

  getChildByPath(key, nextPath: string[] = []) {
    if (nextPath.length > 0) {
      const futureKey = nextPath[0];
      const futurePath = nextPath.filter((item, i) => i !== 0);
      return (this.children[key] as any).getChildByPath(futureKey, futurePath);
    }
    return this.children[key];
  }

  setRootAndParent(root: TRoot, parent: TParent) {
    this.parent = parent;
    this.root = root;
    Object.keys(this.children).forEach((key) => {
      this.children[key].setRootAndParent(root, this);
    });
  }

  dispatchRootChanged() {
    if (this.listeners.formValueChanged) {
      this.listeners.formValueChanged(this.root, this);
    }
    for (let i = 0; i < this.children.length; i++) {
      this.children[i].dispatchRootChanged();
    }
  }

  get value(): TValue {
    return this.control.value;
  }

  setConfig(config: FormoArray<TValue, TRoot, TKey, TParent>['config']) {
    this.config = {
      visible: config.visible || true,
    };
  }

  validationErrors(): FormValidationError[] {
    const errors: FormValidationError[] = [];
    const controlErrors: ValidationErrors = this.control.errors;
    if (controlErrors !== null) {
      Object.keys(controlErrors).forEach((keyError) => {
        errors.push({
          key: this.key,
          error: keyError,
          value: controlErrors[keyError],
          formoType: 'array',
        });
      });
    }
    this.children.forEach((child) => {
      errors.concat(child.validationErrors());
    });
    return errors;
  }
  getChildByKey(key: number) {
    return this.children[key];
  }
}