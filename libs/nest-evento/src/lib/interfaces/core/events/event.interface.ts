export class BaseEventModel {
  readonly busType: 'Event';
  static type;
  readonly type: string;
  readonly target: string;

  constructor(...args: any) {}
}

export function EventModel(
  event: string,
  target?: string
): new (...args: any) => BaseEventModel {
  return class BaseEvent extends BaseEventModel {
    readonly busType: 'Event' = 'Event';
    static type = event;
    readonly type: string = event;
    readonly target: string = target;

    constructor(...args: any) {
      super();
    }
  };
}
export type EventModelType = BaseEventModel;
export type EventModelClassType = new (...args: any) => BaseEventModel;
