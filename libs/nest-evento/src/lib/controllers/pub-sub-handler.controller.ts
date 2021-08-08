import {
  Body,
  Controller,
  HttpException,
  HttpStatus,
  Post,
  Query,
} from '@nestjs/common';
import { MessageHandler } from '../handlers/message-handler';
import { EventoConfigService } from '../services/config.service';
import * as PubSub from '@google-cloud/pubsub';
import { PubSubPushClient } from '../clients/pub-sub-push.client';

@Controller()
export class PubSubHandlerController {
  constructor(
    private readonly config: EventoConfigService,
    private readonly messageHandler: MessageHandler,
    private readonly pubSubPushClient: PubSubPushClient
  ) {}

  @Post('pubsub/push')
  public async root(
    @Query('token') token,
    @Body() body: { message: PubSub.Message }
  ): Promise<void> {
    const verificationToken = this.config.requestResponseToken;
    if (verificationToken) {
      if (verificationToken !== token)
        throw new HttpException('Bad token', HttpStatus.FORBIDDEN);
    }
    try {
      await this.pubSubPushClient.handleMessage(body.message);
    } catch (e) {
      throw new HttpException('Bad request', HttpStatus.BAD_REQUEST);
    }
    return;
  }
}
