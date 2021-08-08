export const REQUEST_RESPONSE_CLIENT = 'REQUEST_RESPONSE_CLIENT';
export const PUBLISH_SUBSCRIBE_CLIENT = 'PUBLISH_SUBSCRIBE_CLIENT';

export interface IRequestOptions {
  endpointName?: string;
}
export interface IEventoConfig {
  requestResponse?: IEventoHttpConfig;
  publishSubscribe?: IEventoPubSubPushConfig | IEventoPubSubPullConfig;
  verificationToken?: string;
}

export enum PublishSubscribeProviders {
  PubSubPush = 'PubSubPush',
  PubSubPull = 'PubSubPull',
}

export enum RequestResponseProviders {
  Http = 'Http',
}

export interface IEventoRequestResponseConfig {
  verificationToken?: string;
  type: RequestResponseProviders;
}
export interface IEventoHttpConfig extends IEventoRequestResponseConfig {
  endpoints: { name: string; url: string }[];
}

export interface IEventoPublishSubscribeConfig {
  verificationToken?: string;
  type: PublishSubscribeProviders;
}

export interface IEventoHttpConfig {
  type: RequestResponseProviders.Http;
}
export interface IEventoPubSubPullConfig extends IEventoPublishSubscribeConfig {
  type: PublishSubscribeProviders.PubSubPull;
  topicName: string;
  projectId: string;
  subscriptionName: string;
}

export interface IEventoPubSubPushConfig extends IEventoPublishSubscribeConfig {
  type: PublishSubscribeProviders.PubSubPush;
  topicName: string;
  projectId: string;
  subscriptionName?: string;
}
