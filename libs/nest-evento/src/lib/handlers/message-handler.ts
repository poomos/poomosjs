import { HttpException, Inject, Injectable } from '@nestjs/common';
import { plainToClass } from 'class-transformer';
import { validate } from 'class-validator';
import { isBaseEvent } from '../utils/kafka-event.utils';
import { CommandBus } from '../bus/command-bus';
import { QueryBus } from '../bus/query-bus';
import { EventBus } from '../bus/event-bus';
import { IBaseEvent } from '../interfaces/core/base-event.interface';
import { ICommandHandler } from '../interfaces/core/commands/command-handler.interface';
import { CommandModelType } from '../interfaces/core/commands/command.interface';
import { QueryModelType } from '../interfaces/core/queries/query.interface';
import { IQueryHandler } from '../interfaces/core/queries/query-handler.interface';
import { IEventHandler } from '../interfaces/core/events/event-handler.interface';
import { EventModelType } from '../interfaces/core/events/event.interface';

@Injectable()
export class MessageHandler {
  constructor(
    @Inject('CommandBus')
    public readonly commandBus: CommandBus,
    @Inject('QueryBus')
    protected readonly queryBus: QueryBus,
    @Inject('EventBus')
    protected readonly eventBus: EventBus
  ) {}

  async onRequest(value: any) {
    console.log(value);
    if (isBaseEvent(value)) {
      const handlerObj = this.findHandler(value);
      if (handlerObj && handlerObj.handlerType === 'query') {
        const model = handlerObj.handler.getModel();
        const event = plainToClass(model, value);
        const errors = await validate(event);
        if (errors.length > 0) {
        } else {
          const result = await handlerObj.handler.handle(event);
          return result;
        }
      }
      if (handlerObj && handlerObj.handlerType === 'command') {
        const model = handlerObj.handler.getModel();
        const event = plainToClass(model, value);
        const errors = await validate(event);
        if (errors.length > 0) {
        } else {
          const result = await handlerObj.handler.handle(event);
          return result;
        }
      }
    }
    throw new HttpException('Not found handler', 500);
  }

  async onSubscription(value: any) {
    if (isBaseEvent(value)) {
      const handlerObj = this.findHandler(value);
      if (handlerObj && handlerObj.handlerType === 'event') {
        const model = handlerObj.handler.getModel();
        const event = plainToClass(model, value);
        const errors = await validate(event);
        if (errors.length > 0) {
        } else {
          await handlerObj.handler.handle(event);
        }
      }
      if (handlerObj && handlerObj.handlerType === 'command') {
        const model = handlerObj.handler.getModel();
        const event = plainToClass(model, value);
        const errors = await validate(event);
        if (errors.length > 0) {
        } else {
          await handlerObj.handler.handle(event);
        }
      }
    }
  }

  findHandler(
    event: IBaseEvent
  ):
    | { handler: ICommandHandler<CommandModelType>; handlerType: 'command' }
    | { handler: IQueryHandler<QueryModelType>; handlerType: 'query' }
    | { handler: IEventHandler<EventModelType>; handlerType: 'event' } {
    const commandHandler = this.commandBus.findHandler(event.type);
    if (commandHandler) {
      return { handler: commandHandler, handlerType: 'command' };
    }
    const queryHandler = this.queryBus.findHandler(event.type);
    if (queryHandler) {
      return { handler: queryHandler, handlerType: 'query' };
    }
    const eventHandler = this.eventBus.findHandler(event.type);
    if (eventHandler) {
      return { handler: eventHandler, handlerType: 'event' };
    }
    return null;
  }
}
