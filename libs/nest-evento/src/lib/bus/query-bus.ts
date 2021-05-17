import { Injectable } from '@nestjs/common';
import { ModuleRef } from '@nestjs/core';
import 'reflect-metadata';
import { MessagePublisher } from '../handlers/message-publisher';
import { IQueryBus } from '../interfaces/queries/query-bus.interface';
import { IQueryHandlerType } from '../interfaces/queries/query-handler.interface';
import { IQueryHandler } from '../interfaces/queries/query-handler.interface';
import { QueryHandlerTypeAndModel } from '../interfaces/queries/query-handler.interface';
import { QueryModelType } from '../interfaces/queries/query.interface';
import { QueryHandlerNotFoundException } from '../exceptions/query-not-found.exception';
import { InvalidQueryHandlerException } from '../exceptions/invalid-query-handler.exception';

@Injectable()
export class QueryBus implements IQueryBus {
  private handlers = new Map<string, IQueryHandlerType>();

  constructor(
    private readonly moduleRef: ModuleRef,
    private readonly messagePublisher: MessagePublisher
  ) {}

  async execute<T extends QueryModelType>(query: T): Promise<T['_resultType']> {
    return this.messagePublisher.request<T['_resultType']>(query);
  }

  async localExecute<T extends QueryModelType = QueryModelType, TResult = any>(
    query: T
  ): Promise<TResult> {
    const handler = this.handlers.get(query.type);
    if (handler) {
      const result = await handler.handle(query);
      return result as TResult;
    } else {
      throw new QueryHandlerNotFoundException(query.type);
    }
  }

  findHandler(queryType: string): IQueryHandler<QueryModelType> | undefined {
    return this.handlers.get(queryType);
  }

  getHandlers() {
    return this.handlers;
  }

  bind(handler: IQueryHandler<QueryModelType>, name: string) {
    this.handlers.set(name, handler);
  }

  register(handlersAndModels: QueryHandlerTypeAndModel[] = []) {
    handlersAndModels.forEach((handlerAndModel) =>
      this.registerHandlerAndModel(handlerAndModel)
    );
  }

  protected registerHandlerAndModel(handlerAndModel: QueryHandlerTypeAndModel) {
    const instance = this.moduleRef.get(handlerAndModel.type, {
      strict: false,
    });
    if (!instance) {
      return;
    }
    const target = handlerAndModel.model;
    if (!target) {
      throw new InvalidQueryHandlerException();
    }
    instance.setModel(target);
    this.bind(instance as IQueryHandlerType, target['type']);
  }
}
