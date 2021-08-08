export interface IEndpoint {
  url: string;
  port: string;
}

export type IEndpointList = {
  [P in string]: IEndpoint;
};
