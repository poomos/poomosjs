import {
  CreateSubscriptionResponse,
  PubSub,
  CreateTopicResponse,
} from '@google-cloud/pubsub';
import { EmulatorConfig } from './interfaces';

export const initSubscribers = async (
  topics: Record<string, CreateTopicResponse>,
  config: EmulatorConfig
): Promise<Record<string, CreateSubscriptionResponse>> => {
  const subscriptions = {};
  if (config.pull) {
    for (let i = 0; i < config.pull.length; i++) {
      subscriptions[config.pull[i].id] = await topics[
        config.pull[i].topic
      ][0].createSubscription(config.pull[i].id);
      console.log(`Subscription ${config.pull[i].id} created.`);
    }
  }
  if (config.push) {
    for (let i = 0; i < config.push.length; i++) {
      subscriptions[config.push[i].id] = await topics[
        config.push[i].topic
      ][0].createSubscription(config.push[i].id, {
        pushEndpoint: config.push[i].endpoint,
      });
      console.log(`Subscription ${config.push[i].id} created.`);
    }
  }
  return subscriptions;
};
