import { Inject, Injectable } from '@nestjs/common';
import { EmulatorConfigInterface } from './emulator-config.interface';
import { PubSub } from '@google-cloud/pubsub';

@Injectable()
export class EmulatorService {
  pubSub: PubSub;
  constructor(
    @Inject('EMULATOR_CONFIG')
    private readonly config: EmulatorConfigInterface
  ) {}

  async run() {
    await this.initInstance();
    await this.initTopics();
  }

  async initInstance() {
    this.pubSub = new PubSub({
      projectId: this.config.projectId,
      apiEndpoint: `localhost:${this.config.serverPort || 8085}`,
    });
  }

  async initTopics() {
    if (this.config.topics) {
      for (const [key, value] of Object.entries(this.config.topics)) {
        await this.createTopic(key);
        await this.initSubscribersPull(key, value.pulls);
        await this.initSubscribersPull(key, value.pushs);
      }
    }
  }

  async initSubscribersPull(topic: string, pulls: { id: string }[]) {
    if (pulls) {
      for (let i = 0; i < pulls.length; i++) {
        const sub = pulls[i];
        try {
          await this.pubSub.topic(topic).createSubscription(sub.id);
        } catch (e) {
          if (e.code !== 6) console.log(e);
        }
      }
    }
  }

  async initSubscribersPush(
    topic: string,
    pulls: { id: string; endpoint: string }[]
  ) {
    if (pulls) {
      for (let i = 0; i < pulls.length; i++) {
        const sub = pulls[i];
        try {
          await this.pubSub.topic(topic).createSubscription(sub.id, {
            pushEndpoint: sub.endpoint,
          });
        } catch (e) {
          if (e.code !== 6) console.log(e);
        }
      }
    }
  }

  async createTopic(name: string) {
    try {
      await this.pubSub.createTopic(name);
    } catch (e) {
      if (e.code !== 6) console.log(e.code);
    }
  }
}
