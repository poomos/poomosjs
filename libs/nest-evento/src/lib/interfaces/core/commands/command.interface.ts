export class BaseCommandModel<R> {
  _resultType: R & { errors?: any };
  readonly busType: 'Command';
  static type: string;
  readonly type: string;
  readonly target: string;
  constructor(...args: any) {}
}

export function CommandModel<R>(
  event: string,
  target?: string
): new (...args: any) => BaseCommandModel<R> {
  return class BaseCommand extends BaseCommandModel<R> {
    readonly busType: 'Command' = 'Command';
    static type = event;
    readonly type: string = event;
    readonly target = target;

    constructor(...args: any) {
      super();
    }
  };
}
export type CommandModelType = BaseCommandModel<any>;
export type CommandModelClassType = new (...args: any) => BaseCommandModel<any>;
