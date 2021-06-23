import { Observable, Subscription } from 'rxjs';
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

@Component({})
export abstract class CrudoListComponent<R>
  implements OnDestroy, OnInit, CrudoTableProperties<R> {
  options: ListComponentOptions = {
    dialogMode: false,
    routeIdParam: 'id',
    routeNewParams: ['create', 'new'],
  };
  subscriptions: Subscription = new Subscription();
  resources: R[];
  resources$: Observable<R[]>;
  resourcesId: string | number = null;

  selectionEnabled: boolean;
  identifierPath: string;
  loading: boolean;

  fields: CrudoTableField<R>[];
  selection = new SelectionModel<R>(true);
  itemActions: CrudoListItemAction<R>[] = [];
  bulkActions: CrudoListBulkAction<R>[] = [];
  quickActions: CrudoListBulkAction<R>[] = [];

  constructor() {}

  ngOnInit() {}

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }
}
