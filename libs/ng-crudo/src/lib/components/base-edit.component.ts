import { Observable, Subscription } from 'rxjs';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormoRoot } from '@poomosjs/ng-formo';
import { ActivatedRoute, Router } from '@angular/router';

interface CrudoEditComponentOptions {
  dialogMode?: boolean;
  routeIdParam?: string;
  routeNewParams: string[];
  loadResource?: boolean;
}

@Component({
  template: '',
})
export abstract class CrudoEditComponent<R> implements OnDestroy, OnInit {
  form: FormoRoot<any>;
  options: CrudoEditComponentOptions = {
    dialogMode: false,
    routeIdParam: 'id',
    routeNewParams: ['create', 'new'],
    loadResource: true,
  };
  subscriptions: Subscription = new Subscription();
  resource: R;
  resourcesId: string | number = null;
  isNew = true;

  constructor(protected route: ActivatedRoute, protected router: Router) {
    this.loadIdFromRoute();
  }

  ngOnInit() {}

  abstract loadResource(id: string);

  abstract rebuildForm(): void;

  loadIdFromRoute() {
    this.subscriptions.add(
      this.route.params.subscribe((params) => {
        const id = params[this.options.routeIdParam];
        if (this.options.routeNewParams.includes(id)) {
          this.isNew = true;
        } else {
          this.isNew = false;
          this.subscriptions.add(
            this.loadResource(id).subscribe((data) => {
              this.resource = data;
            })
          );
        }
        this.resourcesId = id;
      })
    );
  }

  switchToEditRoute(id: string) {
    this.router
      .navigateByUrl(this.router.url.replace(this.resourcesId as string, id))
      .then();
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }
}
