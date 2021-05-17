import {
  isNil,
  isString,
  isUndefined,
} from '@nestjs/common/utils/shared.utils';
import { randomStringGenerator } from '@nestjs/common/utils/random-string-generator.util';
import { EventEmitter } from 'events';
import { MessageHandler } from '../handlers/message-handler';
import { Inject } from '@angular/core';
import { PubSubOptionService } from './option.interface';
import { Injectable } from '@nestjs/common';
import * as PubSub from '@google-cloud/pubsub';
import { dateReviver } from '../utils/date.util';

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
export class PubSubService {
  protected client: PubSub.PubSub;
  protected topicName: string;
  protected projectId: string;
  protected subscriptionName: string;
  protected responseEmitter: EventEmitter;

  constructor(
    @Inject('MessageHandler')
    public messageHandler: MessageHandler,
    public options: PubSubOptionService
  ) {
    this.topicName = options.config.topicName;
    this.projectId = options.config.projectId;
    this.subscriptionName = options.config.subscriptionName;
  }

  start() {
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
    const correlationId = message.attributes[PubSubAttributes.CORRELATION_ID];
    const replyTopic = message.attributes[PubSubAttributes.REPLY_TOPIC];
    if (this.isReply(message) && correlationId) {
      this.responseEmitter.emit(correlationId, this.fromMessage(message.data));
    } else {
      if (this.isRequest(message) && correlationId) {
        await this.messageHandler.onRequest(
          this.fromMessage(message.data),
          this.getReplier(replyTopic, correlationId)
        );
      } else {
        await this.messageHandler.onDispatch(this.fromMessage(message.data));
      }
    }
  }
  public async request(message: any, timeout = 10000): Promise<any> {
    return new Promise(async (resolve, reject) => {
      const correlationId = randomStringGenerator();
      let attributes = {};
      attributes[PubSubAttributes.IS_REQUEST] = '1';
      attributes[PubSubAttributes.CORRELATION_ID] = correlationId;
      attributes[PubSubAttributes.REPLY_TOPIC] = this.topicName;
      const listener = (value) => {
        clearTimeout(timer);
        this.responseEmitter.removeListener(correlationId, listener);
        resolve(value);
      };
      const timer = setTimeout(() => {
        this.responseEmitter.removeListener(correlationId, listener);
        reject({ completed: false });
      }, timeout);

      this.responseEmitter.once(correlationId, listener);
      const messageId = await this.client
        .topic(this.topicName)
        .publish(this.toMessage(message), attributes);
    });
  }

  public async publish(message: any): Promise<any> {
    const messageId = await this.client
      .topic(this.topicName)
      .publish(this.toMessage(message));
  }

  public getReplier(
    replyTopic: string,
    correlationId: string
  ): (data: any) => Promise<any> {
    return (data: any) => this.reply(data, replyTopic, correlationId);
  }

  public async reply(message: any, replyTopic, correlationId): Promise<any> {
    let attributes = {};
    attributes[PubSubAttributes.IS_REPLY] = '1';
    attributes[PubSubAttributes.CORRELATION_ID] = correlationId;
    return await this.client
      .topic(replyTopic)
      .publish(this.toMessage(message), attributes);
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

  isRequest(message: PubSub.Message) {
    return message.attributes[PubSubAttributes.IS_REQUEST] === '1';
  }

  isReply(message: PubSub.Message) {
    return message.attributes[PubSubAttributes.IS_REPLY] === '1';
  }
}
