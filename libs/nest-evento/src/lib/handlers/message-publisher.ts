import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { PubSubService } from '../services/pub-sub.service';
import { EventModelType } from '../interfaces/events/event.interface';
import { CommandModelType } from '../interfaces/commands/command.interface';
import { QueryModelType } from '../interfaces/queries/query.interface';

@Injectable()
export class MessagePublisher {
  constructor(
    @Inject(forwardRef(() => PubSubService))
    private readonly client: PubSubService
  ) {}

  publish(event: EventModelType | CommandModelType): Promise<any> {
    return this.client.publish(event);
  }

  async request<TResult>(
    event: QueryModelType | CommandModelType
  ): Promise<TResult> {
    const result = await this.client.request(event);
    return result;
  }

  // @TODO
  reply() {}
}
