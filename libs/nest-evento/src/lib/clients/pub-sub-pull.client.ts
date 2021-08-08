import {
  isNil,
  isString,
  isUndefined,
} from '@nestjs/common/utils/shared.utils';
import { EventEmitter } from 'events';
import { MessageHandler } from '../handlers/message-handler';
import { Inject } from '@angular/core';
import { Injectable } from '@nestjs/common';
import * as PubSub from '@google-cloud/pubsub';
import { dateReviver } from '../utils/date.util';
import { IPublishSubscribeClient } from '../interfaces/client/client-publish-subscribe.interface';
import { IEventoConfig } from '../interfaces/core/config.interface';

@Injectable()
export class PubSubPullClient implements IPublishSubscribeClient {
  protected client: PubSub.PubSub;
  protected topicName: string;
  protected projectId: string;
  protected subscriptionName: string;
  protected responseEmitter: EventEmitter;

  constructor(
    @Inject('MessageHandler')
    public messageHandler: MessageHandler
  ) /*   @Inject('EVENTO_CLIENT')
    public options: IEventoConfig*/
  {
    /*    this.topicName = options.publishSubscribe.topicName;
    this.projectId = options.publishSubscribe.projectId;
    this.subscriptionName = options.publishSubscribe.subscriptionName;*/
  }

  async initSubscription() {
    this.client = new (PubSub as any).PubSub({ projectId: this.projectId });
    this.responseEmitter = new EventEmitter();
    this.listenForMessages();
  }

  listenForMessages() {
    const subscription = this.client.subscription(this.subscriptionName);

    const messageHandler = async (message: PubSub.Message) => {
      try {
        await this.handleMessage(message);
        message.ack();
      } catch (e) {
        console.log('messageHandler', e);
        message.ack();
      }
    };
    subscription.on('message', messageHandler);
  }

  public async handleMessage(message: PubSub.Message) {
    await this.messageHandler.onSubscription(this.fromMessage(message.data));
  }

  public async publish(message: any): Promise<any> {
    const messageId = await this.client
      .topic(this.topicName)
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

  fromMessage(payload: Buffer): object | string | null | number {
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
}
