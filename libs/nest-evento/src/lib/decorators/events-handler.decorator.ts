import 'reflect-metadata';
import { EVENT_HANDLER_METADATA } from './constants';
import { EventModelClassType } from '../interfaces/core/events/event.interface';

export const EventHandler = (event: EventModelClassType): ClassDecorator => {
  return (target: Record<string, any>) => {
    Reflect.defineMetadata(EVENT_HANDLER_METADATA, event, target);
  };
};
