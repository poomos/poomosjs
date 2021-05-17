import { Injectable } from '@nestjs/common';
import { ModuleRef } from '@nestjs/core';
import 'reflect-metadata';
import { MessagePublisher } from '../handlers/message-publisher';
import { ICommandBus } from '../interfaces/commands/command-bus.interface';
import { ICommandHandlerType } from '../interfaces/commands/command-handler.interface';
import { ICommandHandler } from '../interfaces/commands/command-handler.interface';
import { CommandHandlerTypeAndModel } from '../interfaces/commands/command-handler.interface';
import { CommandModelClassType } from '../interfaces/commands/command.interface';
import { BaseCommandModel } from '../interfaces/commands/command.interface';
import { CommandHandlerNotFoundException } from '../exceptions/command-not-found.exception';
import { InvalidCommandHandlerException } from '../exceptions/invalid-command-handler.exception';

@Injectable()
export class CommandBus implements ICommandBus {
  private handlers = new Map<string, ICommandHandlerType>();
  private models = new Map<string, CommandModelClassType>();

  constructor(
    private readonly moduleRef: ModuleRef,
    private readonly messagePublisher: MessagePublisher
  ) {}

  async execute<T extends BaseCommandModel<any>>(
    command: T
  ): Promise<T['_resultType']> {
    return this.messagePublisher.request<T['_resultType']>(command);
  }

  async localExecute<T extends BaseCommandModel<any>>(
    command: T
  ): Promise<T['_resultType']> {
    const handler = this.handlers.get(command.type);
    if (handler) {
      const result = await handler.handle(command);
      return result;
    } else {
      throw new CommandHandlerNotFoundException(command.type);
    }
  }

  private bind(handler: ICommandHandlerType, name: string) {
    this.handlers.set(name, handler);
  }

  findHandler(
    commandName: string
  ): ICommandHandler<BaseCommandModel<any>> | undefined {
    return this.handlers.get(commandName);
  }

  getHandlers() {
    return this.handlers;
  }

  register(handlersAndModels: CommandHandlerTypeAndModel[] = []) {
    handlersAndModels.forEach((handlerAndModel) =>
      this.registerHandlerAndModel(handlerAndModel)
    );
  }

  protected registerHandlerAndModel(
    handlerAndModel: CommandHandlerTypeAndModel
  ) {
    const instance = this.moduleRef.get(handlerAndModel.type, {
      strict: false,
    });
    if (!instance) {
      return;
    }
    const target = handlerAndModel.model;
    if (!target) {
      throw new InvalidCommandHandlerException();
    }
    instance.setModel(target);
    this.bind(instance as ICommandHandlerType, target['type']);
  }
}
