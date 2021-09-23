import { Module } from '@nestjs/common';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import {
  NestEventoModule,
  PublishSubscribeProviders,
  RequestResponseProviders,
} from '@poomosjs/nest-evento';
import { NestPubSubEmulatorModule } from '@poomosjs/nest-pubsub';

@Module({
  imports: [
    NestEventoModule.forAsyncRoot(async () => {
      return {
        publishSubscribe: {
          type: PublishSubscribeProviders.PubSubPush,
          topicName: 'cloud-test',
          projectId: 'cloud-test',
          subscriptionName: 'cloud-test',
        },
        requestResponse: {
          type: RequestResponseProviders.Http,
          endpoints: [
            {
              name: 'test',
              url: ' http://localhost:3333/api/evento-http-handler',
            },
          ],
        },
      };
    }),
    NestPubSubEmulatorModule.register({
      projectId: 'fb',
      topics: {
        duyfgi: {
          pushs: [{ id: 'uygih', endpoint: 'https://jhfguk' }],
        },
      },
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
