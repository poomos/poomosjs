import 'reflect-metadata';
import { QUERY_HANDLER_METADATA } from './constants';
import { QueryModelClassType } from '../interfaces/queries/query.interface';

export const QueryHandler = (query: QueryModelClassType): ClassDecorator => {
  return (target: object) => {
    Reflect.defineMetadata(QUERY_HANDLER_METADATA, query, target);
  };
};
