export class BaseQueryModel<R> {
  _resultType: R;
  readonly busType: 'Query';
  static type;
  readonly type: string;
  readonly target: string;
  constructor(...args: any) {}
}

export function QueryModel<R = void>(
  event: string,
  target?: string
): new (...args: any) => BaseQueryModel<R> {
  return class BaseQuery extends BaseQueryModel<R> {
    readonly target = target;
    readonly busType: 'Query' = 'Query';
    static type = event;
    readonly type: string = event;

    constructor(...args: any) {
      super();
    }
  };
}
export type QueryModelType = BaseQueryModel<any>;
export type QueryModelClassType = new (...args: any) => BaseQueryModel<any>;
