import {
  isNil,
  isString,
  isUndefined,
} from '@nestjs/common/utils/shared.utils';
import { MessageHandler } from '../handlers/message-handler';
import { Inject } from '@angular/core';
import {
  forwardRef,
  HttpService,
  Injectable,
  ServiceUnavailableException,
} from '@nestjs/common';
import * as PubSub from '@google-cloud/pubsub';
import { dateReviver } from '../utils/date.util';
import { IRequestResponseClient } from '../interfaces/client/client-publish-subscribe.interface';
import { EventoConfigService } from '../services/config.service';
import { QueryModelType } from '../interfaces/core/queries/query.interface';
import { CommandModelType } from '../interfaces/core/commands/command.interface';
import { IRequestOptions } from '../interfaces/core/config.interface';
import { InternalServerErrorException } from '@nestjs/common/exceptions/internal-server-error.exception';

@Injectable()
export class HttpRequestClient implements IRequestResponseClient {
  constructor(
    public config: EventoConfigService,
    @Inject('MessageHandler')
    public messageHandler: MessageHandler,
    private httpService: HttpService
  ) {
    // console.log(config.);
  }

  public async handleMessage(message: PubSub.Message) {
    await this.messageHandler.onSubscription(this.fromMessage(message.data));
  }

  public async request(
    event: QueryModelType | CommandModelType,
    options?: IRequestOptions
  ): Promise<any> {
    const endpoint = this.findEndpoint(options?.endpointName || event.target);
    if (!endpoint) {
      throw new InternalServerErrorException(
        `Endpoint not found for ${event.type}`
      );
    }
    return this.httpService.post(endpoint, event).toPromise();
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

  findEndpoint(endpointName: string): string {
    if (this.config?.requestResponse?.endpoints) {
      const e = this.config?.requestResponse?.endpoints.find(
        (v) => v.name === endpointName
      );
      return e ? e['url'] : null;
    }
    return null;
  }
}
