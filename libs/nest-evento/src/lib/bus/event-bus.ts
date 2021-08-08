import { Injectable } from '@nestjs/common';
import { ModuleRef } from '@nestjs/core';
import { MessageSender } from '../handlers/message-sender';
import { IEventBus } from '../interfaces/core/events/event-bus.interface';
import { IEventHandlerType } from '../interfaces/core/events/event-handler.interface';
import { IEventHandler } from '../interfaces/core/events/event-handler.interface';
import { EventModelType } from '../interfaces/core/events/event.interface';
import { InvalidEventHandlerException } from '../exceptions/invalid-events-handler.exception';
import { EventHandlerTypeAndModel } from '../interfaces/core/handlers-list.interface';

@Injectable()
export class EventBus implements IEventBus {
  private handlers = new Map<string, IEventHandlerType>();

  constructor(
    private readonly moduleRef: ModuleRef,
    private readonly messagePublisher: MessageSender
  ) {}

  publish<T extends EventModelType = EventModelType>(event: T) {
    return this.messagePublisher.publish(event);
  }

  private bind(handler: IEventHandlerType, name: string) {
    this.handlers.set(name, handler);
  }

  findHandler(eventName: string): IEventHandler<EventModelType> | undefined {
    return this.handlers.get(eventName);
  }

  register(handlersAndModels: EventHandlerTypeAndModel[] = []) {
    handlersAndModels.forEach((handlerAndModel) =>
      this.registerHandler(handlerAndModel)
    );
  }

  protected registerHandler(handlerAndModel: EventHandlerTypeAndModel) {
    const instance = this.moduleRef.get(handlerAndModel.type, {
      strict: false,
    });
    if (!instance) {
      return;
    }
    const target = handlerAndModel.model;
    if (!target) {
      throw new InvalidEventHandlerException();
    }
    instance.setModel(target);
    this.bind(instance as IEventHandlerType, target['type']);
  }
}
