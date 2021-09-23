import { Component } from '@angular/core';
import { createFormSchema, FormoFieldTypes } from '@poomosjs/ng-formo';

export interface FormationForm {
  name: number;
  isModule: boolean;
  sub: { kgl?: string };
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
      gui: 'luh',
      name: {
        type: FormoFieldTypes.Switch,
        defaultValue: 1,
      },
      gui: 'luh',
      sub: {
        children: {
          kgl: {
            type: FormoFieldTypes.Checkbox,
            defaultValue: 'r',
          },
        },
      },
      isModule: {
        type: FormoFieldTypes.Switch,
        defaultValue: false,
      },
      moduleIds: { type: FormoFieldTypes.Switch, defaultValue: [] },
      hgfjj: {
        model: {
          children: {
            kgl: {
              type: FormoFieldTypes.Switch,
              defaultValue: 'rf',
            },
          },
        },
      },
    },
  }).generateForm();

  constructor() {
    console.log(this.fd);
  }
}
