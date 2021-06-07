import { Component, OnDestroy, OnInit } from '@angular/core';
import { Observable, of, Subscription } from 'rxjs';
import { SelectionModel } from '@angular/cdk/collections';
import { ICrudoListQuickAction } from '../models/list';
import { ICrudoListItemAction } from '../models/list';
import { ICrudoListBulkAction } from '../models/list';
import { ICrudoListQuickActionWithOptions } from '../models/list';
import { ICursorInfo } from '@poomosjs/core';
import { defaultCursorInfo } from '@poomosjs/core';
import { ICrudoTableField } from '../models/table';
import { IResource } from '@poomosjs/core';
import { ICrudoTableConfig } from '../models/table';
import { defaultPoomosTableConfig } from '../models/table';

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
