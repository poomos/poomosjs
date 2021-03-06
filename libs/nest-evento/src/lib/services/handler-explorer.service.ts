import { Injectable, Type } from '@nestjs/common';
import { ModulesContainer } from '@nestjs/core/injector/modules-container';
import {
  COMMAND_HANDLER_METADATA,
  EVENT_HANDLER_METADATA,
  QUERY_HANDLER_METADATA,
} from '../decorators/constants';

import { flatMap } from 'lodash';
import {
  CommandHandlerTypeAndModel,
  EventHandlersList,
  EventHandlerTypeAndModel,
  QueryHandlerTypeAndModel,
} from '../interfaces/core/handlers-list.interface';

@Injectable()
export class HandlerExplorerService {
  constructor(private readonly modulesContainer: ModulesContainer) {}

  exploreHandlers(): EventHandlersList {
    const commands = this.findCommandHandler();
    const queries = this.findQueryHandler();
    const events = this.findEventHandler();
    return { commands, queries, events };
  }

  getAllProviders(): Record<string, any>[] {
    const modulesMap = [...this.modulesContainer.entries()];
    return flatMap(modulesMap, ([key, nestModule]) => {
      const components = [...nestModule['providers'].values()];
      return components.map((component) => {
        const { instance } = component;
        return instance;
      });
    });
  }
  findCommandHandler(): CommandHandlerTypeAndModel[] {
    const commands = [];
    this.getAllProviders().forEach((instance) => {
      if (instance) {
        if (instance.constructor) {
          const metadata = Reflect.getOwnMetadata(
            COMMAND_HANDLER_METADATA,
            instance.constructor
          );
          if (metadata) {
            commands.push({
              type: instance.constructor as Type<any>,
              model: metadata,
            });
          }
        }
      }
    });
    return commands;
  }

  findEventHandler(): EventHandlerTypeAndModel[] {
    const events = [];
    this.getAllProviders().forEach((instance) => {
      if (instance) {
        if (instance.constructor) {
          const metadata = Reflect.getOwnMetadata(
            EVENT_HANDLER_METADATA,
            instance.constructor
          );
          if (metadata) {
            events.push({
              type: instance.constructor as Type<any>,
              model: metadata,
            });
          }
        }
      }
    });
    return events;
  }

  findQueryHandler(): QueryHandlerTypeAndModel[] {
    const queries = [];
    this.getAllProviders().forEach((instance) => {
      if (instance) {
        if (instance.constructor) {
          const metadata = Reflect.getOwnMetadata(
            QUERY_HANDLER_METADATA,
            instance.constructor
          );
          if (metadata) {
            queries.push({
              type: instance.constructor as Type<any>,
              model: metadata,
            });
          }
        }
      }
    });
    return queries;
  }
}
