import { FormGroup } from '@angular/forms';
import * as _ from 'lodash';
import { Subscription } from 'rxjs';
import { startWith } from 'rxjs/operators';
import { FormoBaseWrapper } from '../base/formo-base-wrapper';
import { FormValidationError } from '../base/validation-error';
import { IFormoRoot } from './formo-root.interface';
import { FormoRootSchema } from './formo-root.schema';
import { FormoArraySchema } from '../array/formo-array.schema';
import { FormoGroupSchema } from '../group/formo-group.schema';
import { FormoFieldSchema } from '../field/formo-field.schema';
import { FormoArray } from '../array/formo-array';
import { FormoField } from '../field/formo-field';
import { FormoGroup } from '../group/formo-group';

export class FormoRoot<TValue extends Record<string, any>>
  extends FormoBaseWrapper<'group'>
  implements IFormoRoot<TValue>
{
  subscriptions: Subscription = new Subscription();
  /*  readonly _keys: keyof this['children'];
  readonly _paths: this['_keys'] extends string
    ? `${this['children'][this['_keys']]['_paths']}` | this['_keys']
    : never;*/
  readonly _type: TValue;
  form: FormGroup;
  children: IFormoRoot<TValue>['children'];
  formValueChanged?: (root: IFormoRoot<TValue>) => void;

  constructor(args: { children: FormoRoot<TValue>['children'] }) {
    super();
    this.children = args.children;
    this.form = new FormGroup({});
  }
  static toSchema<TValue extends Record<string, any>>(
    schema: FormoRootSchema<TValue>
  ): FormoRoot<TValue> {
    const children: Record<string, any> = {};
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

    return new FormoRoot<TValue>({
      children,
    });
  }
  createForm() {
    Object.keys(this.children).forEach((key) => {
      this.children[key].onGenerateForm(this, this);
    });
    this.subscriptions.add(
      this.form.valueChanges
        .pipe(startWith({}))
        .subscribe(() => this.dispatchRootChanged())
    );
    return this;
  }

  dispatchRootChanged() {
    if (this.formValueChanged) {
      this.formValueChanged(this);
    }
    Object.keys(this.children).forEach((key) => {
      this.children[key].dispatchRootChanged();
    });
  }

  get control(): FormGroup {
    return this.form;
  }
  prepareForValue(value) {
    Object.keys(this.children).forEach((key) => {
      this.children[key].prepareForValue(_.get(value, key));
    });
  }

  valueByPath(pathString: string) {
    return;
  }

  patchValue(value: Partial<TValue>) {
    this.prepareForValue(value);
    this.form.patchValue(value);
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
    this.prepareForValue(value);
    this.form.setValue(value, options);
  }

  get value(): TValue {
    return this.form.value;
  }

  getChildByKey(key: string | number) {
    return this.children[key];
  }

  get(prop: string) {
    return this.children[prop];
  }

  validationErrors(): FormValidationError[] {
    let errors: FormValidationError[] = [];
    Object.keys(this.children).forEach((key) => {
      errors = [...errors, ...this.children[key].validationErrors()];
    });
    return errors;
  }

  close() {
    this.subscriptions.unsubscribe();
    Object.keys(this.children).forEach((key) => {
      //   this.children[key].close();
    });
  }
}
