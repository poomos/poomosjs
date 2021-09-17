import { IRequestOptions } from '../core/config.interface';
import { QueryModelType } from '../core/queries/query.interface';
import { CommandModelType } from '../core/commands/command.interface';
import { EventModelType } from '../core/events/event.interface';

export interface IPublishSubscribeClient {
  publish(event: EventModelType | CommandModelType): Promise<any>;
}

export interface IRequestResponseClient {
  request(
    event: QueryModelType | CommandModelType,
    options?: IRequestOptions
  ): Promise<any>;
}
