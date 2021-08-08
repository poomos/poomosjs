export interface EmulatorConfig {
  projectId: string;
  serverPort: number;
  topics: string[];
  pull: { topic: string; id: string }[];
  push: { topic: string; id: string; endpoint: string }[];
}
