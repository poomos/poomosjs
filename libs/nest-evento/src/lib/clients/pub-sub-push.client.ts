import {
  isNil,
  isString,
  isUndefined,
} from '@nestjs/common/utils/shared.utils';
import { EventEmitter } from 'events';
import { MessageHandler } from '../handlers/message-handler';
import { Inject, Injectable } from '@nestjs/common';
import * as PubSub from '@google-cloud/pubsub';
import { dateReviver } from '../utils/date.util';
import { IPublishSubscribeClient } from '../interfaces/client/client-publish-subscribe.interface';
import { EventoConfigService } from '../services/config.service';

export enum PubSubAttributes {
  CORRELATION_ID = 'correlationId',
  NEST_ERROR = 'nest_error',
  NEST_IS_DISPOSED = 'nest_isDisposed',
  REPLY_PARTITION = 'replyPartition',
  REPLY_TOPIC = 'replyTopic',
  IS_REPLY = 'isReply',
  IS_REQUEST = 'isRequest',
}

@Injectable()
export class PubSubPushClient implements IPublishSubscribeClient {
  protected _client: PubSub.PubSub;
  protected responseEmitter: EventEmitter;

  constructor(
    public config: EventoConfigService,
    public messageHandler: MessageHandler
  ) {}

  get client(): PubSub.PubSub {
    if (this._client) {
      return this._client;
    } else {
      this._client = new PubSub.PubSub({
        projectId: this.config.publishSubscribe.projectId,
        ...(this.config.publishSubscribe.useEmulator
          ? { apiEndpoint: 'localhost', port: '8085' }
          : {}),
      });
      return this._client;
    }
  }

  public async handleMessage(message: PubSub.Message) {
    await this.messageHandler.onSubscription(this.fromMessage(message.data));
  }

  public async publish(message: any): Promise<any> {
    await this.client
      .topic(this.config.publishSubscribe.topicName)
      .publish(this.toMessage(message));
  }

  toMessage(payload: any) {
    const isObjectOrArray =
      !isNil(payload) && !isString(payload) && !Buffer.isBuffer(payload);
    if (isObjectOrArray) {
      return Buffer.from(JSON.stringify(payload));
    } else if (isUndefined(payload)) {
      return null;
    }
    return Buffer.from(payload);
  }

  fromMessage(payload: Buffer): Record<string, any> | string | null | number {
    if (isNil(payload)) {
      return null;
    }
    let result = payload.toString();
    const startChar = result.charAt(0);
    if (startChar === '{' || startChar === '[') {
      try {
        result = JSON.parse(payload.toString(), dateReviver);
      } catch (e) {}
    }
    return result;
  }

  isRequest(message: PubSub.Message) {
    return message.attributes[PubSubAttributes.IS_REQUEST] === '1';
  }

  isReply(message: PubSub.Message) {
    return message.attributes[PubSubAttributes.IS_REPLY] === '1';
  }
}
