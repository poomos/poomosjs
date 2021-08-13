import { FormGroup } from '@angular/forms';
import * as _ from 'lodash';
import { Subscription } from 'rxjs';
import { startWith } from 'rxjs/operators';
import {
  FormRootChild,
  IFormoRootListeners,
} from '../interfaces/formo-root.interface';
import { FormValidationError } from '../interfaces/validation/validation-error';
import { IFormoRootArgs } from '../interfaces/formo-root.interface';
import { FormoBaseWrapper } from './formo-base-wrapper';

export class FormoRoot<
  // eslint-disable-next-line @typescript-eslint/ban-types
  TValue extends object
> extends FormoBaseWrapper {
  subscriptions: Subscription = new Subscription();
  readonly _type: TValue;
  form: FormGroup;
  children: FormRootChild<TValue>;
  listeners: IFormoRootListeners<TValue>;

  constructor(args: IFormoRootArgs<TValue>) {
    super();
    this.children = args.children;
    this.listeners = args.listeners || {};
    this.form = new FormGroup({});
    //return new Proxy<this & FormRootChild<TValue>>(this as any, {});
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
  }

  dispatchRootChanged() {
    if (this.listeners.formValueChanged) {
      this.listeners.formValueChanged(this);
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

  path(t: this, name: string) {
    return t[name];
  }
  patchValue(value: Partial<TValue>) {
    this.prepareForValue(value);
    this.form.patchValue(value);
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
      this.children[key].close();
    });
  }
}
