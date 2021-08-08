import {
  CrudoTableField,
  CrudoTableFieldTypes,
  CrudoTableProperties,
} from '../interfaces/table.interface';
import {
  CrudoListBulkAction,
  CrudoListItemAction,
} from '../interfaces/list.interface';
import { Component, Input } from '@angular/core';
import { SelectionModel } from '@angular/cdk/collections';
import { Observable } from 'rxjs';
import { get } from 'lodash';

@Component({
  template: '',
})
export abstract class CrudoTableComponent implements CrudoTableProperties<any> {
  tableFieldTypes = CrudoTableFieldTypes;
  @Input()
  selectionEnabled = true;
  @Input()
  identifierPath = 'id';
  @Input()
  resources$: Observable<any[]>;
  @Input()
  loading: false;
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

  getFieldValue(field: CrudoTableField, row: any) {
    if (field.dynamicDisplay) {
      return field.dynamicDisplay(get(row, field.property));
    } else {
      return get(row, field.property);
    }
  }
}
