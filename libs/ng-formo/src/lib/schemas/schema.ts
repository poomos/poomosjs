import { FormoRootSchema } from './formo-root.schema';
import { FormoRoot } from '../models/formo-root';
import { createFormFromSchema } from './form-creator';

export const createFormSchema = <TValue extends object>(
  schema: FormoRootSchema<TValue>
): FormSchema<TValue> => {
  return new FormSchema<TValue>(schema);
};

export class FormSchema<TValue extends object> {
  constructor(public schema: FormoRootSchema<TValue>) {}

  generateForm(): FormoRoot<TValue> {
    const form = createFormFromSchema<TValue>(this.schema);
    form.createForm();
    return form;
  }
}
