import 'reflect-metadata';
import { EVENT_HANDLER_METADATA } from './constants';
import { EventModelClassType } from '../interfaces/events/event.interface';

export const EventHandler = (event: EventModelClassType): ClassDecorator => {
  return (target: object) => {
    Reflect.defineMetadata(EVENT_HANDLER_METADATA, event, target);
  };
};
