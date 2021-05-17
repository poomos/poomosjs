import { Injectable } from '@nestjs/common';

export interface PubSubOptions {
  topicName: string;
  projectId: string;
  subscriptionName: string;
}

@Injectable()
export class PubSubOptionService {
  config: PubSubOptions;

  constructor(config: PubSubOptions) {
    this.config = config;
  }
}
