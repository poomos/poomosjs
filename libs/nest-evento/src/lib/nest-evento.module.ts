import { Module } from '@nestjs/common';
import { OnApplicationBootstrap } from '@nestjs/common';
import { DynamicModule } from '@nestjs/common';
import { PubSubService } from './services/pub-sub.service';
import { ExplorerService } from './services/explorer.service';
import { EventBus } from './bus/event-bus';
import { QueryBus } from './bus/query-bus';
import { CommandBus } from './bus/command-bus';
import { PubSubOptionService } from './services/option.interface';
import { MessageHandler } from './handlers/message-handler';
import { MessagePublisher } from './handlers/message-publisher';

@Module({
  imports: [],
  providers: [],
  exports: [],
})
export class NestEventoModule implements OnApplicationBootstrap {
  constructor(
    private readonly pubSubService: PubSubService,
    private readonly explorerService: ExplorerService,
    private readonly eventsBus: EventBus,
    private readonly commandsBus: CommandBus,
    private readonly queryBus: QueryBus
  ) {}

  async onApplicationBootstrap() {
    const { events, queries, commands } = this.explorerService.explore();
    this.eventsBus.register(events);
    this.commandsBus.register(commands);
    this.queryBus.register(queries);

    // @TODO Await
    await this.pubSubService.start();
  }

  public static forRoot(options): DynamicModule {
    return {
      global: true,
      module: NestEventoModule,
      imports: [],
      providers: [
        {
          provide: PubSubOptionService,
          useValue: new PubSubOptionService(options),
        },
        PubSubService,
        ExplorerService,
        EventBus,
        CommandBus,
        QueryBus,
        MessageHandler,
        MessagePublisher,
      ],
      exports: [
        {
          provide: PubSubOptionService,
          useValue: new PubSubOptionService(options),
        },
        PubSubService,
        ExplorerService,
        EventBus,
        CommandBus,
        QueryBus,
        MessageHandler,
        MessagePublisher,
      ],
    };
  }
}
