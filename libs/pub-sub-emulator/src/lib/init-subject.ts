import { PubSub, CreateTopicResponse } from '@google-cloud/pubsub';
import { EmulatorConfig } from './interfaces';

export const initSubject = async (
  pubSub: PubSub,
  config: EmulatorConfig
): Promise<Record<string, CreateTopicResponse>> => {
  const topics = {};
  for (let i = 0; i < config.topics.length; i++) {
    topics[config.topics[i]] = await pubSub.createTopic(config.topics[i]);
    console.log(`Topic ${config.topics[i]} created.`);
  }
  return topics;
};
