import {
  FormArray,
  FormControl,
  FormGroup,
  ValidationErrors,
} from '@angular/forms';

export abstract class FormoBaseWrapper {
  abstract get control(): FormControl | FormGroup | FormArray;
  get dirty(): boolean {
    return this.control.dirty;
  }

  get valid(): boolean {
    return this.control.valid;
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
