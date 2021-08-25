import { FormoRootSchema } from '../root/formo-root.schema';
import { FormoRoot } from '../root/formo-root';
import { createFormFromSchema } from './form-creator';
import { FormoObject, FormoRequiredType } from '../shared/utils.interface';

export const createFormSchema = <TValue extends FormoObject>(
  schema: FormoRootSchema<FormoRequiredType<TValue>>
): FormSchema<FormoRequiredType<TValue>> => {
  return new FormSchema<FormoRequiredType<TValue>>(schema);
};

export class FormSchema<TValue extends FormoObject> {
  constructor(public schema: FormoRootSchema<TValue>) {}

  generateForm(): FormoRoot<TValue> {
    const form = createFormFromSchema<TValue>(this.schema);
    form.createForm();
    return form;
  }
}
