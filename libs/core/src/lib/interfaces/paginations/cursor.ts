export type CursorType = string;

export interface ICursorArgs {
  first?: number;
  last?: number;
  before?: string;
  after?: string;
}

export const defaultCursorArgs: ICursorArgs = {
  first: 10,
  last: null,
  before: null,
  after: null,
};

export interface ICursorInfo {
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  startCursor?: string;
  endCursor?: string;
}

export const defaultCursorInfo: ICursorInfo = {
  hasNextPage: false,
  hasPreviousPage: false,
  startCursor: null,
  endCursor: null,
};

export interface IEdgeType<T> {
  cursor: string;
  node: T;
}
export interface IConnectionPager<T> {
  edges: IEdgeType<T>[];
  nodes: T[];
  totalCount: number;
  cursorInfo: ICursorInfo;
}
