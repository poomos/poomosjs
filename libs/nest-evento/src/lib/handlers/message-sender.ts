import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { EventModelType } from '../interfaces/core/events/event.interface';
import { CommandModelType } from '../interfaces/core/commands/command.interface';
import {
  IPublishSubscribeClient,
  IRequestResponseClient,
} from '../interfaces/client/client-publish-subscribe.interface';
import { QueryModelType } from '../interfaces/core/queries/query.interface';
import {
  IRequestOptions,
  PUBLISH_SUBSCRIBE_CLIENT,
  REQUEST_RESPONSE_CLIENT,
} from '../interfaces/core/config.interface';

@Injectable()
export class MessageSender {
  constructor(
    @Inject(forwardRef(() => PUBLISH_SUBSCRIBE_CLIENT))
    private readonly publishSubscribe: IPublishSubscribeClient,
    @Inject(forwardRef(() => REQUEST_RESPONSE_CLIENT))
    private readonly requestResponse: IRequestResponseClient
  ) {
    // console.log(requestResponse);
  }

  publish(event: EventModelType | CommandModelType): Promise<any> {
    return this.publishSubscribe.publish(event);
  }

  request<T extends QueryModelType | CommandModelType>(
    event: T,
    options?: IRequestOptions
  ): Promise<T['_resultType']> {
    return this.requestResponse.request(event, options);
  }
}
