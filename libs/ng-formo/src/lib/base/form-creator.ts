import {
  FormoRootFromSchema,
  FormoRootSchema,
} from '../root/formo-root.schema';
import { FormoRoot } from '../root/formo-root';
import { FormoFieldSchema } from '../field/formo-field.schema';
import { FormoField } from '../field/formo-field';

import { FormoGroupSchema } from '../group/formo-group.schema';
import { FormoGroup } from '../group/formo-group';
import { FormoArraySchema } from '../array/formo-array.schema';
import { FormoArray } from '../array/formo-array';
import { FormGroupChild } from '../group/formo-group.type';
import { FormRootChild } from '../root/formo-root.type';
import { FormoSchemaCanBeParent } from '../shared/formo-parent.schema';
import { FormoArrayModel } from '../array/formo-array.type';
import {
  FormoObject,
  FormoScalarOrArrayScalar,
} from '../shared/utils.interface';

export const createFormFromSchema = <TValue extends FormoObject>(
  schema: FormoRootSchema<TValue>
): FormoRoot<TValue> => {
  // @ts-ignore
  const children: FormRootChild<TValue> = {};
  Object.keys(schema.children).forEach((key) => {
    if (schema.children[key]['model']) {
      // @ts-ignore
      children[key] = arrayFromSchema(
        key,
        schema.children[key] as FormoArraySchema<any, any, any, any>
      );
    } else {
      if (schema.children[key]['children']) {
        // @ts-ignore
        children[key] = groupFromSchema(
          key,
          schema.children[key] as FormoGroupSchema<any, any, any, any>
        );
      } else {
        // @ts-ignore
        children[key] = fieldFromSchema(
          key,
          schema.children[key] as FormoFieldSchema<any, any, any, any>
        );
      }
    }
  });
  return new FormoRoot<TValue>({
    listeners: schema.listeners,
    children,
  });
};

export const groupFromSchema = <
  TValue extends FormoObject,
  TRoot extends FormoRootSchema<any>,
  TKey extends string,
  TParent extends FormoSchemaCanBeParent
>(
  key: TKey,
  schema: FormoGroupSchema<TValue, TRoot, TKey, TParent>
): FormoGroup<TValue, FormoRootFromSchema<TRoot>, TKey, any> => {
  const children: FormGroupChild<
    TValue,
    FormoRootFromSchema<TRoot>,
    TKey,
    any
  > = {} as any;
  Object.keys(schema.children).forEach((key) => {
    if (schema.children[key]['model']) {
      // @ts-ignore
      children[key] = arrayFromSchema(
        key,
        schema.children[key] as FormoArraySchema<any, any, any, any>
      );
    } else {
      if (schema.children[key]['children']) {
        // @ts-ignore
        children[key] = groupFromSchema(
          key,
          schema.children[key] as FormoGroupSchema<any, any, any, any>
        );
      } else {
        // @ts-ignore
        children[key] = fieldFromSchema(
          key,
          schema.children[key] as FormoFieldSchema<any, any, any, any>
        );
      }
    }
  });
  return new FormoGroup<TValue, FormoRootFromSchema<TRoot>, TKey, any>({
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
  TParent extends FormoSchemaCanBeParent
>(
  key: TKey,
  schema: FormoArraySchema<TValue, TRoot, TKey, TParent>
): FormoArray<TValue, FormoRootFromSchema<TRoot>, TKey, any> => {
  let model: FormoArrayModel<TValue, FormoRootFromSchema<TRoot>, TKey, any>;
  if (schema.model['children']) {
    model = () => groupFromSchema(key, schema.model['children']) as any;
  }
  if (schema.model['model']) {
    model = () => arrayFromSchema(key, schema.model['model']) as any;
  }
  return new FormoArray<TValue, FormoRootFromSchema<TRoot>, TKey, any>({
    model,
    listeners: schema.listeners,
    config: schema.config,
    key,
  });
};

export const fieldFromSchema = <
  TValue extends FormoScalarOrArrayScalar,
  TRoot extends FormoRootSchema<any>,
  TKey extends string,
  TParent extends FormoSchemaCanBeParent
>(
  key: TKey,
  field: FormoFieldSchema<TValue, TRoot, TKey, TParent>
): FormoField<TValue, FormoRootFromSchema<TRoot>, TKey, any> => {
  return new FormoField<TValue, FormoRootFromSchema<TRoot>, TKey, any>({
    listeners: field.listeners,
    config: field.config,
    key,
    validation: field.validation,
  });
};
