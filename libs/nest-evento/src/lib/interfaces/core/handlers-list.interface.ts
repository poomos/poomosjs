import { CommandHandlerType } from './commands/command-handler.interface';
import { EventHandlerType } from './events/event-handler.interface';
import { QueryHandlerType } from './queries/query-handler.interface';
import { EventModelClassType } from './events/event.interface';
import { QueryModelClassType } from './queries/query.interface';
import { CommandModelClassType } from './commands/command.interface';

export type EventHandlerTypeAndModel = {
  type: EventHandlerType;
  model: EventModelClassType;
};

export type CommandHandlerTypeAndModel = {
  type: CommandHandlerType;
  model: CommandModelClassType;
};

export type QueryHandlerTypeAndModel = {
  type: QueryHandlerType;
  model: QueryModelClassType;
};
export interface EventHandlersList {
  events?: EventHandlerTypeAndModel[];
  queries?: QueryHandlerTypeAndModel[];
  commands?: CommandHandlerTypeAndModel[];
}
