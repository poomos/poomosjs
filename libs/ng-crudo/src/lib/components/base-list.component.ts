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

interface ListComponentOptions {
  dialogMode?: boolean;
  routeIdParam?: string;
  routeNewParams?: string[];
}

@Component({
  template: '',
})
export abstract class CrudoListComponent<R>
  implements OnDestroy, OnInit, CrudoTableProperties<R> {
  options: ListComponentOptions = {
    dialogMode: false,
    routeIdParam: 'id',
    routeNewParams: ['create', 'new'],
  };
  subscriptions: Subscription = new Subscription();
  protected dataSource$: Observable<R[]>;
  resourcesId: string | number = null;

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
  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }
}
