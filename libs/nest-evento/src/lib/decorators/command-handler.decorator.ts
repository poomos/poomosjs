import 'reflect-metadata';
import { COMMAND_HANDLER_METADATA } from './constants';
import { CommandModelClassType } from '../interfaces/commands/command.interface';

export const CommandHandler = (
  command: CommandModelClassType
): ClassDecorator => {
  return (target) => {
    Reflect.defineMetadata(COMMAND_HANDLER_METADATA, command, target);
  };
};
