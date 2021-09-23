import { FormArray, ValidationErrors } from '@angular/forms';

import { FormoBaseWrapper } from '../base/formo-base-wrapper';
import { FormValidationError } from '../base/validation-error';
import { IFormoArray, IFormoArrayConfig } from './formo-array.interface';
import { IFormoRoot } from '../root/formo-root.interface';
import {
  FormoRootFromSchema,
  FormoRootSchema,
} from '../root/formo-root.schema';
import { FormoGroupSchema } from '../group/formo-group.schema';
import { FormoGroup } from '../group/formo-group';
import { IFormoGroup } from '../group/formo-group.interface';
import { FormoArraySchema } from './formo-array.schema';

export class FormoArray<
    TValue extends Array<any>,
    TKey extends string,
    TRoot extends IFormoRoot<any>,
    TParent extends IFormoRoot<any> | IFormoGroup<any, any, any, any>
  >
  extends FormoBaseWrapper<'array'>
  implements IFormoArray<TValue, TKey, TRoot, TParent>
{
  initialControl: FormArray;
  arrayIndex: number;
  root: TRoot;
  parent: TParent;
  key: TKey;
  model;
  children;
  formValueChanged?: (root: TRoot, current: this) => void;
  onCustomEvent?: (event: string, value: unknown, current: this) => void;

  constructor(
    args: { key: TKey } & {
      model: IFormoArray<TValue, TKey, TRoot, TParent>['model'];
    } & IFormoArrayConfig<TValue, TRoot>
  ) {
    super();
    this.key = args.key;
    this.model = args.model;
    this.children = [];
    this.updateConfig(args);
    this.initialControl = new FormArray([]);
  }

  static toSchema<
    TValue extends Array<any>,
    TKey extends string,
    TRoot extends FormoRootSchema<any>
  >(
    key: TKey,
    schema: FormoArraySchema<TValue, TKey, TRoot>
  ): IFormoArray<TValue, TKey, FormoRootFromSchema<TRoot>, any> {
    let model: IFormoArray<
      TValue,
      TKey,
      FormoRootFromSchema<TRoot>,
      any
    >['model'] = null;

    if (schema.model.children) {
      model = () => FormoGroup.toSchema(key, schema.model);
    } else {
      // model = () => FormoField.toSchema(key, schema.children[key] as FormoFieldSchema<any, any, any>)
    }

    return new FormoArray<TValue, TKey, FormoRootFromSchema<TRoot>, any>({
      key,
      model,
    });
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
    if (this.formValueChanged) {
      this.formValueChanged(this.root, this);
    }
    for (let i = 0; i < this.children.length; i++) {
      this.children[i].dispatchRootChanged();
    }
  }

  get value(): TValue {
    return this.control.value;
  }

  updateConfig(config: IFormoArrayConfig<TValue, TRoot>) {
    for (const [key, value] of Object.entries(config)) {
      this[key] = value;
    }
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
