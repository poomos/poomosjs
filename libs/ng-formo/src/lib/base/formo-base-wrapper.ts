import {
  FormArray,
  FormControl,
  FormGroup,
  ValidationErrors,
} from '@angular/forms';
import { FormoRoot } from '../root/formo-root';
import { FormoGroup } from '../group/formo-group';
import { FormoArray } from '../array/formo-array';
import { FormoObject } from '../shared/utils.interface';

export abstract class FormoBaseWrapper {
  abstract get control(): FormControl | FormGroup | FormArray;
  get dirty(): boolean {
    return this.control.dirty;
  }

  get valid(): boolean {
    return this.control.valid;
  }

  get invalid(): boolean {
    return this.control.invalid;
  }

  get pristine(): boolean {
    return this.control.pristine;
  }

  get errors(): ValidationErrors {
    return this.control.errors;
  }

  get disabled() {
    return this.control.disabled;
  }

  get untouched() {
    return this.control.untouched;
  }

  get touched() {
    return this.control.touched;
  }
}

export interface IFormoBaseChild<
  TRoot extends FormoRoot<any>,
  TParent extends FormoCanBeParent
> {
  setRootAndParent(root: TRoot, parent: TParent);
}

export type FormoCanBeParent =
  | FormoGroup<FormoObject, FormoRoot<any>, string, FormoCanBeParent>
  | FormoRoot<FormoObject>
  | FormoArray<Array<any>, FormoRoot<any>, string, FormoCanBeParent>;
