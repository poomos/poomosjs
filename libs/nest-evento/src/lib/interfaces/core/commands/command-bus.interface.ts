import { CommandModelType } from './command.interface';

export interface ICommandBus {
  request<T extends CommandModelType>(command: T): Promise<T['_resultType']>;
  publish<T extends CommandModelType>(command: T): Promise<any>;
}
