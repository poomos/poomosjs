export class BaseQueryModel<R> {
  _resultType: R;
  readonly busType: 'Query';
  static type;
  readonly type: string;

  constructor(...args: any) {}
}

export function QueryModel<R = void>(
  event: string & (R extends void ? 'No type parameter was supplied' : string)
): new (...args: any) => BaseQueryModel<R> {
  return class BaseQuery extends BaseQueryModel<R> {
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
