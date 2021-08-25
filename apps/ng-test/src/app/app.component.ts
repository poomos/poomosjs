import { Component } from '@angular/core';
import { createFormSchema, FormoFieldTypes } from '@poomosjs/ng-formo';
import { RefDocument } from '@poomosjs/nest-utils';

export interface FormationForm {
  name: number;
  isModule: boolean;
  hgfjj: { kgl?: string }[];
  moduleIds: string[];
}

@Component({
  selector: 'poomosjs-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  title = 'ng-test';

  fd = createFormSchema<FormationForm>({
    children: {
      name: {
        config: { type: FormoFieldTypes.Switch, value: 1 },
      },
      isModule: {
        config: { type: FormoFieldTypes.Switch, value: false },
      },
      moduleIds: { config: { type: FormoFieldTypes.Switch, value: [] } },
      hgfjj: {
        model: {
          children: {
            kgl: {
              config: { type: FormoFieldTypes.Switch, value: 'rf' },
            },
          },
        },
      },
    },
  }).generateForm();

  constructor() {
    console.log(this.fd.children);
  }
}
