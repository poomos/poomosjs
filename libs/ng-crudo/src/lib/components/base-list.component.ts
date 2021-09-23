import { isObservable, Observable, of, Subscription } from 'rxjs';
import { Component, OnDestroy, OnInit } from '@angular/core';
import {
  CrudoTableField,
  CrudoTableProperties,
} from '../interfaces/table.interface';
import {
  CrudoListBulkAction,
  CrudoListItemAction,
} from '../interfaces/list.interface';
import { SelectionModel } from '@angular/cdk/collections';
import { defaultCursorInfo, ICursorInfo } from '@poomosjs/core';

interface ListComponentOptions {
  dialogMode?: boolean;
  routeIdParam?: string;
  routeNewParams?: string[];
}

@Component({
  template: '',
})
export abstract class CrudoListComponent<R>
  implements OnDestroy, OnInit, CrudoTableProperties<R>
{
  options: ListComponentOptions = {
    dialogMode: false,
    routeIdParam: 'id',
    routeNewParams: ['create', 'new'],
  };
  subscriptions: Subscription = new Subscription();
  dataSource$: Observable<R[]>;
  resourcesId: string | number = null;
  cursorInfo: ICursorInfo = defaultCursorInfo;

  selectionEnabled = true;
  identifierPath: string;
  loading: boolean;

  fields: CrudoTableField<R>[];
  selection = new SelectionModel<R>(true);
  itemActions: CrudoListItemAction<R>[] = [];
  bulkActions: CrudoListBulkAction<R>[] = [];
  quickActions: CrudoListBulkAction<R>[] = [];

  constructor() {}

  ngOnInit() {}

  get resources$(): Observable<R[]> {
    return this.dataSource$;
  }

  setResources(resources: R[] | Observable<R[]>) {
    if (isObservable(resources)) {
      this.dataSource$ = resources;
    } else {
      this.dataSource$ = of(resources);
    }
  }

  addField(field: CrudoTableField) {
    this.fields.push(field);
  }

  addQuickAction(action: CrudoListBulkAction<R>) {
    this.quickActions.push(action);
  }

  addItemAction(action: CrudoListItemAction<R>) {
    this.itemActions.push(action);
  }

  addBulkAction(action: CrudoListBulkAction<R>) {
    this.bulkActions.push(action);
  }
  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }
}
