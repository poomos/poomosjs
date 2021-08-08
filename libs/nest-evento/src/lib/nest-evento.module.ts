import {
  DynamicModule,
  Global,
  HttpModule,
  Inject,
  Module,
  OnApplicationBootstrap,
  Provider,
} from '@nestjs/common';
import { HandlerExplorerService } from './services/handler-explorer.service';
import { EventBus } from './bus/event-bus';
import { QueryBus } from './bus/query-bus';
import { CommandBus } from './bus/command-bus';
import { MessageHandler } from './handlers/message-handler';
import { MessageSender } from './handlers/message-sender';
import {
  IEventoConfig,
  PUBLISH_SUBSCRIBE_CLIENT,
  PublishSubscribeProviders,
  REQUEST_RESPONSE_CLIENT,
  RequestResponseProviders,
} from './interfaces/core/config.interface';
import { HttpHandlerController } from './controllers/http-handler.controller';
import { IPublishSubscribeClient } from './interfaces/client/client-publish-subscribe.interface';
import { PubSubPushClient } from './clients/pub-sub-push.client';
import { PubSubPullClient } from './clients/pub-sub-pull.client';
import { HttpRequestClient } from './clients/http-request.client';
import { ConfigModule, ConfigService, registerAs } from '@nestjs/config';
import { EventoConfigService } from './services/config.service';
import { PubSubHandlerController } from './controllers/pub-sub-handler.controller';

const Services = [
  EventoConfigService,
  HandlerExplorerService,
  EventBus,
  CommandBus,
  QueryBus,
  MessageHandler,
  MessageSender,
  HttpRequestClient,
];

function getPublishSubscribeClient(options: IEventoConfig): Provider<any> {
  if (options.publishSubscribe) {
    switch (options?.publishSubscribe.type) {
      case PublishSubscribeProviders.PubSubPush:
        return {
          provide: PUBLISH_SUBSCRIBE_CLIENT,
          useClass: PubSubPushClient,
        };
      case PublishSubscribeProviders.PubSubPull:
        return {
          provide: PUBLISH_SUBSCRIBE_CLIENT,
          useClass: PubSubPullClient,
        };
    }
  }
  return {
    provide: PUBLISH_SUBSCRIBE_CLIENT,
    useValue: null,
  };
}
function getRequestResponseClient(options: IEventoConfig): Provider<any>[] {
  if (options.requestResponse) {
    switch (options?.requestResponse.type) {
      case RequestResponseProviders.Http:
        return [
          HttpRequestClient,
          {
            provide: REQUEST_RESPONSE_CLIENT,
            useClass: HttpRequestClient,
          },
        ];
    }
  }
  return [
    {
      provide: REQUEST_RESPONSE_CLIENT,
      useValue: null,
    },
  ];
}
const createProviders = (options: IEventoConfig): Provider<any>[] => {
  return [
    ...getRequestResponseClient(options),
    getPublishSubscribeClient(options),
  ];
};

@Global()
@Module({
  imports: [ConfigModule.forRoot()],
  providers: [EventoConfigService],
  exports: [],
})
export class NestEventoModule implements OnApplicationBootstrap {
  constructor(
    private readonly explorerService: HandlerExplorerService,
    private readonly eventsBus: EventBus,
    private readonly commandsBus: CommandBus,
    private readonly queryBus: QueryBus,
    @Inject(PUBLISH_SUBSCRIBE_CLIENT)
    private readonly publishSubscribeClient: IPublishSubscribeClient,
    private configService: ConfigService<{ nest_evento: { host: string } }>
  ) {}

  async onApplicationBootstrap() {
    const {
      events,
      queries,
      commands,
    } = this.explorerService.exploreHandlers();
    this.eventsBus.register(events);
    this.commandsBus.register(commands);
    this.queryBus.register(queries);
    // @TODO Await
    if (this.publishSubscribeClient) {
      await this.publishSubscribeClient.initSubscription();
    }
  }

  public static forRoot(options: IEventoConfig): DynamicModule {
    return {
      global: true,
      module: NestEventoModule,
      imports: [
        ConfigModule.forRoot(),
        ConfigModule.forFeature(registerAs('nest_evento', () => options)),
        ...(options?.requestResponse?.type == RequestResponseProviders.Http
          ? [HttpModule]
          : []),
      ],
      controllers: [
        ...(options?.requestResponse?.type == RequestResponseProviders.Http
          ? [HttpHandlerController]
          : []),
        ...(options?.publishSubscribe?.type ==
        PublishSubscribeProviders.PubSubPush
          ? [PubSubHandlerController]
          : []),
      ],
      providers: [...Services, ...createProviders(options)],
      exports: [...createProviders(options), ...Services],
    };
  }

  public static async forAsyncRoot(
    factory: () => Promise<IEventoConfig>
  ): Promise<DynamicModule> {
    return NestEventoModule.forRoot(await factory());
  }
}
