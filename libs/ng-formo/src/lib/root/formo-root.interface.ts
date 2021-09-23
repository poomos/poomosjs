import { IFormoBaseWrapper } from '../base/formo-base.interface';
import { Subscription } from 'rxjs';
import { FormGroup } from '@angular/forms';
import { IFormoArray } from '../array/formo-array.interface';
import { FormoScalarOrArrayScalar } from '../shared/utils.interface';
import { FormValidationError } from '../base/validation-error';
import { IFormoField } from '../field/formo-field.interface';
import { IFormoGroup } from '../group/formo-group.interface';

export interface IFormoRoot<TValue extends Record<string, any>>
  extends IFormoBaseWrapper<'group'> {
  subscriptions: Subscription;
  readonly _type: TValue;
  form: FormGroup;
  dispatchRootChanged();
  control: FormGroup;
  prepareForValue(value);
  valueByPath(pathString: string);

  patchValue(value: Partial<TValue>);
  setValue(
    value: TValue,
    options?: {
      onlySelf?: boolean;
      emitEvent?: boolean;
      emitModelToViewChange?: boolean;
      emitViewToModelChange?: boolean;
    }
  ): void;
  value: TValue;
  getChildByKey(key: string | number);
  get(prop: string);
  validationErrors(): FormValidationError[];
  close();
  formValueChanged?: (root: IFormoRoot<TValue>) => void;
  createForm(): this;
  children: {
    [K in keyof TValue & string]: TValue[K] extends FormoScalarOrArrayScalar
      ? IFormoField<
          TValue[K],
          K extends string ? K : string,
          IFormoRoot<TValue>,
          IFormoRoot<TValue>
        >
      : TValue[K] extends Array<any>
      ? IFormoArray<
          TValue[K],
          K extends string ? K : string,
          IFormoRoot<TValue>,
          IFormoRoot<TValue>
        >
      : TValue[K] extends Record<string, any>
      ? IFormoGroup<
          TValue[K],
          K extends string ? K : string,
          IFormoRoot<TValue>,
          IFormoRoot<TValue>
        >
      : never;
  };
}
