import { CrudoListBulkAction, CrudoListItemAction } from './list.interface';
import { SelectionModel } from '@angular/cdk/collections';
import { Observable } from 'rxjs';

export interface CrudoTableProperties<T> {
  selectionEnabled: boolean;
  resources$: Observable<any[]>;
  identifierPath: string;
  loading: boolean;
  selection: SelectionModel<T>;
  itemActions: CrudoListItemAction<T>[];
  bulkActions: CrudoListBulkAction<T>[];
  quickActions: CrudoListBulkAction<T>[];
  fields: CrudoTableField<T>[];
}

export enum CrudoTableFieldTypes {
  TEXT = 'TEXT',
  LINK = 'LINK',
  BIG_TEXT = 'BIG_TEXT',
  BOOLEAN = 'BOOLEAN',
  BADGE = 'BADGE',
  DYNAMIC_DISPLAY = 'DYNAMIC_DISPLAY',
}

export interface CrudoTableField<T = any> {
  key: string;
  label: string;
  property: string;
  type: CrudoTableFieldTypes | string;
  dynamicDisplay?: (data: any) => any;
}
