export interface EmulatorConfigInterface {
  projectId: string;
  serverPort?: number;
  topics: {
    [t: string]: {
      pulls?: { id: string }[];
      pushs?: { id: string; endpoint: string }[];
    };
  };
}
