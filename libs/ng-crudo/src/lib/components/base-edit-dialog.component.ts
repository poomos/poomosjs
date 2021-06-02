import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { IResource } from '@lebonip/ts-common';
import { FormoRoot } from '@omidis/ng-formo';

@Component({ template: '' })
export abstract class CrudoEditComponent<T extends IResource>
  implements OnInit, OnDestroy {
  isNew = true;
  resource: T;
  data: any;
  subscriptions: Subscription = new Subscription();
  abstract form: FormoRoot<any>;

  constructor() {}

  ngOnInit() {
    this.resource = this.createResource();
    this.form.createForm();
    this.rebuildForm();
  }

  abstract createResource(): T;

  abstract rebuildForm();

  abstract save();

  reset() {
    this.rebuildForm();
  }

  prepareSave(): T {
    return Object.assign({}, this.resource, this.form.value);
  }

  abstract onCancel();

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }
}
