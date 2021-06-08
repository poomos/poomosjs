import { FormoRootFromSchema, FormoRootSchema } from './formo-root.schema';
import { FormoRoot } from '../models/formo-root';
import { FormRootChild } from '../interfaces/formo-root.interface';
import { FormoFieldSchema } from './formo-field.schema';
import { FormoField } from '../models/formo-field';
import {
  FormoParentFromSchema,
  FormoParentSchema,
} from './formo-parent.schema';
import { FormoGroupSchema } from './formo-group.schema';
import { FormoGroup } from '../models/formo-group';
import { FormGroupChild } from '../interfaces/formo-group.interface';
import { FormoArraySchema } from './formo-array.schema';
import { FormoArray } from '../models/formo-array';
import { FormoArrayModel } from '../interfaces/formo-array.interface';

export const createFormFromSchema = <TValue extends object>(
  schema: FormoRootSchema<TValue>
): FormoRoot<TValue> => {
  const children: FormRootChild<TValue> = {} as any;
  Object.keys(schema.children).forEach((key) => {
    if (schema.children[key].model) {
      children[key] = arrayFromSchema(key, schema.children[key]);
    } else {
      if (schema.children[key].children) {
        children[key] = groupFromSchema(key, schema.children[key]);
      } else {
        children[key] = fieldFromSchema(key, schema.children[key]);
      }
    }
  });
  return new FormoRoot<TValue>({
    listeners: schema.listeners,
    children,
  });
};

export const groupFromSchema = <
  TValue extends object,
  TRoot extends FormoRootSchema<any>,
  TKey extends string,
  TParent extends FormoParentSchema
>(
  key: TKey,
  schema: FormoGroupSchema<TValue, TRoot, TKey, TParent>
): FormoGroup<
  TValue,
  FormoRootFromSchema<TRoot>,
  TKey,
  FormoParentFromSchema<TParent>
> => {
  const children: FormGroupChild<
    TValue,
    FormoRootFromSchema<TRoot>,
    TKey,
    FormoParentFromSchema<TParent>
  > = {} as any;
  Object.keys(schema.children).forEach((key) => {
    if (schema.children[key].model) {
      children[key] = arrayFromSchema(key, schema.children[key]);
    } else {
      if (schema.children[key].children) {
        children[key] = groupFromSchema(key, schema.children[key]);
      } else {
        children[key] = fieldFromSchema(key, schema.children[key]);
      }
    }
  });
  return new FormoGroup<
    TValue,
    FormoRootFromSchema<TRoot>,
    TKey,
    FormoParentFromSchema<TParent>
  >({
    children,
    listeners: schema.listeners,
    config: schema.config,
    key,
    validation: schema.validation,
  });
};

export const arrayFromSchema = <
  TValue extends Array<any>,
  TRoot extends FormoRootSchema<any>,
  TKey extends string,
  TParent extends FormoParentSchema
>(
  key: TKey,
  schema: FormoArraySchema<TValue, TRoot, TKey, TParent>
): FormoArray<
  TValue,
  FormoRootFromSchema<TRoot>,
  TKey,
  FormoParentFromSchema<TParent>
> => {
  let model: FormoArrayModel<
    TValue,
    FormoRootFromSchema<TRoot>,
    TKey,
    FormoParentFromSchema<TParent>
  >;
  if (schema.model['children']) {
    model = () => groupFromSchema(key, schema.model['children']) as any;
  }
  if (schema.model['model']) {
    model = () => arrayFromSchema(key, schema.model['model']) as any;
  }
  return new FormoArray<
    TValue,
    FormoRootFromSchema<TRoot>,
    TKey,
    FormoParentFromSchema<TParent>
  >({
    model,
    listeners: schema.listeners,
    config: schema.config,
    key,
  });
};

export const fieldFromSchema = <
  TValue,
  TRoot extends FormoRootSchema<any>,
  TKey extends string,
  TParent extends FormoParentSchema
>(
  key: TKey,
  field: FormoFieldSchema<TValue, TRoot, TKey, TParent>
): FormoField<
  TValue,
  FormoRootFromSchema<TRoot>,
  TKey,
  FormoParentFromSchema<TParent>
> => {
  return new FormoField<
    TValue,
    FormoRootFromSchema<TRoot>,
    TKey,
    FormoParentFromSchema<TParent>
  >({
    listeners: field.listeners,
    config: field.config,
    key,
    validation: field.validation,
  });
};
