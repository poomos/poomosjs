import { Component } from '@angular/core';
import { FormoFieldTypes, formSchema } from '@poomosjs/ng-formo';

export interface FormationForm {
  name: string;
  isModule: boolean;
  hgfjj: { kgl: string }[];
  moduleIds?: string[];
}
@Component({
  selector: 'poomosjs-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  title = 'ng-test';

  fd = formSchema<FormationForm>({
    children: {
      name: {
        config: { type: FormoFieldTypes.Switch, value: '' },
      },
      isModule: {
        config: { type: FormoFieldTypes.Switch, value: 'rf' },
      },
      moduleIds: {
        config: { type: FormoFieldTypes.Switch, value: 'rf' },
      },
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
    console.log(this.fd.children.);
  }
}
