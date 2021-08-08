import { PubSub } from '@google-cloud/pubsub';
import { EmulatorConfig } from './interfaces';
export const initInstance = (config: EmulatorConfig): PubSub => {
  return new PubSub({
    projectId: config.projectId,
    apiEndpoint: `localhost:${config.serverPort || 8085}`,
  });
};
