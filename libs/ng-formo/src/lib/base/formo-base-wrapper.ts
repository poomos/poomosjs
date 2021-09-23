import {
  FormArray,
  FormControl,
  FormGroup,
  ValidationErrors,
} from '@angular/forms';
import { IFormoBaseWrapper } from './formo-base.interface';

export abstract class FormoBaseWrapper<T extends 'array' | 'group' | 'control'>
  implements IFormoBaseWrapper<T>
{
  abstract control: T extends 'array'
    ? FormArray
    : T extends 'group'
    ? FormGroup
    : FormControl;
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
