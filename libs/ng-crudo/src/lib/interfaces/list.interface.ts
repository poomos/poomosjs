export interface CrudoListItemAction<T> {
  action: (item: T) => any;
  name: string;
  icon: string;
}

export interface CrudoListBulkAction<T> {
  name: string;
  icon?: string;
  action: (items: T[]) => any;
  options: string[];
}

export interface CrudoListQuickAction {
  action: () => any;
  name: string;
  icon?: string;
  options?: string[];
}
