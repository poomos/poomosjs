import 'reflect-metadata';
import { COMMAND_HANDLER_METADATA } from './constants';
import { CommandModelClassType } from '../interfaces/core/commands/command.interface';

export const CommandHandler = (
  command: CommandModelClassType
): ClassDecorator => {
  return (target) => {
    Reflect.defineMetadata(COMMAND_HANDLER_METADATA, command, target);
  };
};
