import { FormoRoot } from '../root/formo-root';
import {
  FormArray,
  FormControl,
  FormGroup,
  ValidationErrors,
} from '@angular/forms';

export interface IFormoBaseChild<
  TRoot extends FormoRoot<any>,
  TParent extends any
> {
  setRootAndParent(root: TRoot, parent: TParent);
}

export interface IFormoBaseWrapper<T extends 'array' | 'group' | 'control'> {
  control: T extends 'array'
    ? FormArray
    : T extends 'group'
    ? FormGroup
    : FormControl;
  get dirty(): boolean;

  get valid(): boolean;

  get invalid(): boolean;

  get pristine(): boolean;

  get errors(): ValidationErrors;

  get disabled(): boolean;

  get untouched(): boolean;
  get touched(): boolean;
}
