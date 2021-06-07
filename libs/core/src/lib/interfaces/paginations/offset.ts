export interface IOffsetArgs {
  limit?: number;
  offset?: number;
}

export const defaultOffsetArgs: IOffsetArgs = {
  limit: 10,
  offset: 1,
};
