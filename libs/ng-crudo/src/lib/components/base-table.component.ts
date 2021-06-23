import {
  CrudoTableField,
  CrudoTableProperties,
} from '../interfaces/table.interface';
import {
  CrudoListBulkAction,
  CrudoListItemAction,
} from '../interfaces/list.interface';
import { Input } from '@angular/core';
import { SelectionModel } from '@angular/cdk/collections';

export class CrudoTableComponent implements CrudoTableProperties<any> {
  @Input()
  selectionEnabled: boolean;
  @Input()
  identifierPath: string;
  @Input()
  loading: boolean;
  @Input()
  itemActions: CrudoListItemAction<any>[];
  @Input()
  bulkActions: CrudoListBulkAction<any>[];
  @Input()
  quickActions: CrudoListBulkAction<any>[];
  @Input()
  fields: CrudoTableField<any>[];
  @Input()
  selection: SelectionModel<any>;
}
