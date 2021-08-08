import { QueryModelType } from './query.interface';

export interface IQueryBus {
  request<T extends QueryModelType>(query: T): Promise<T['_resultType']>;
}
