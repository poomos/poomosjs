import { Component, OnDestroy, OnInit } from '@angular/core';
import { Observable, of, Subscription } from 'rxjs';
import {
  defaultPoomosTableConfig,
  ICrudoListBulkAction,
  ICrudoListItemAction,
  ICrudoListQuickAction,
  ICrudoListQuickActionWithOptions,
  ICrudoTableConfig,
  ICrudoTableField,
} from '../models';
import { SelectionModel } from '@angular/cdk/collections';
import { defaultCursorInfo, ICursorInfo, IResource } from '@lebonip/ts-common';

@Component({ template: '' })
export abstract class CrudoListComponent<T extends IResource>
  implements OnInit, OnDestroy {
  subscriptions: Subscription[] = [];

  identifierPath = 'id';
  quickActions: ICrudoListQuickAction[] = [];
  itemActions: ICrudoListItemAction<T>[] = [];
  bulkActions: ICrudoListBulkAction<T>[] = [];
  quickActionsWithOption: ICrudoListQuickActionWithOptions[] = [];
  resources: Observable<T[]> = of([]);
  loading = false;
  selection = new SelectionModel<T>(true);
  limit = 10;
  cursorInfo: ICursorInfo = defaultCursorInfo;
  fields?: ICrudoTableField[];

  tableConfig: ICrudoTableConfig<T> = {
    ...defaultPoomosTableConfig,
    itemActions: this.itemActions,
    bulkActions: this.bulkActions,
  };

  abstract loadData();

  abstract loadMoreData(endCursor: string);

  constructor() {}

  ngOnInit() {
    this.loadData();
  }

  onActivate(event) {}

  toogleSelect(selected: T) {
    this.selection.toggle(selected);
  }

  select(selected: T) {
    this.selection.select(selected);
  }

  unselect(unselected: T) {
    this.selection.deselect(unselected);
  }

  ngOnDestroy() {
    this.subscriptions.forEach((subs) => subs.unsubscribe());
  }

  addQuickAction(action: ICrudoListQuickAction) {
    this.quickActions.push(action);
  }

  addItemAction(action: ICrudoListItemAction<T>) {
    this.itemActions.push(action);
  }

  addQuickActionWithOption(action: ICrudoListQuickActionWithOptions) {
    this.quickActionsWithOption.push(action);
  }

  addBulkAction(action: ICrudoListBulkAction<T>) {
    this.bulkActions.push(action);
  }
}
