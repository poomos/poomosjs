import { Observable, Subscription } from 'rxjs';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormoRoot } from '@poomosjs/ng-formo';
import { ActivatedRoute, Router } from '@angular/router';

interface CrudoEditComponentOptions {
  dialogMode?: boolean;
  routeIdParam?: string;
  routeNewParams: string[];
  loadIdFromRoute?: boolean;
}

@Component({
  template: '',
})
export abstract class CrudoEditComponent<R> implements OnDestroy, OnInit {
  options: CrudoEditComponentOptions = {
    routeIdParam: 'id',
    routeNewParams: ['create', 'new'],
    loadIdFromRoute: true,
  };
  subscriptions: Subscription = new Subscription();
  resource: R;
  resourcesId: string | number = null;
  isNew = true;

  constructor(protected route: ActivatedRoute, protected router: Router) {}

  ngOnInit() {
    if (this.options.loadIdFromRoute) {
      this.loadIdFromRoute();
    }
  }

  loadIdFromRoute() {
    this.subscriptions.add(
      this.route.params.subscribe((params) => {
        const id = params[this.options.routeIdParam];
        if (this.options.routeNewParams.includes(id)) {
          this.isNew = true;
        } else {
          this.isNew = false;
        }
        this.resourcesId = id;
        this.routeLoaded();
      })
    );
  }

  routeLoaded() {}

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }
}
