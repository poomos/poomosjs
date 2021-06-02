export interface ICrudoListItemAction<T> {
  action: (item: T) => any;
  name: string;
  icon: string;
}

export interface ICrudoListBulkAction<T> {
  name: string;
  icon?: string;
  action: (items: T[]) => any;
}

export interface ICrudoListQuickAction {
  action: () => any;
  name: string;
  icon?: string;
}

export interface ICrudoListQuickActionWithOptions {
  action: (option?: string) => any;
  name: string;
  icon?: string;
  options: string[];
}

export interface ICrudoListBulkActionWithOptions {
  action: (option?: string) => any;
  name: string;
  icon?: string;
  options: string[];
}

export class CrudoListConfig<T> {
  selectionEnabled?: boolean;
  identifierPath?: string;
  loading?: boolean;
  /*  fields?: PoomosTableField[];
  itemActions?: CrudListItemAction<T>[] = [];
  bulkActions?: CrudListBulkAction<T>[] = [];
  cursorInfo?: ICursorInfo;

  constructor(options: ICrudoTableField) {
    this.name = options.name;
    this.label = options.label || options.name;
    this.property = options.property || options.name;
    this.type = options.type || TableFieldTypes.TEXT;
    this.dynamicDisplay = options.dynamicDisplay || null;
  }*/
}
