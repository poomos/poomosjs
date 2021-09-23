import {
  Component,
  ContentChild,
  Input,
  OnInit,
  TemplateRef,
} from '@angular/core';
import { FormGroup } from '@angular/forms';

export abstract class BaseFormoArrayComponent implements OnInit {
  @Input() form: FormGroup;
  @Input() path: string;
  @Input() addTitle: string;
  @Input() loopClass: string;
  @Input() panelClass: string;
  @Input() useAccordion = false;
  @ContentChild('FormTemplate', { static: false }) FormTemplate: TemplateRef<{
    index: number;
  }>;

  constructor() {}

  ngOnInit() {
    if (this.path === null || this.path === undefined) {
      throw new TypeError('The input ‘FormPath’ is required');
    }
    if (this.form === null || this.form === undefined) {
      throw new TypeError('The input ‘Field’ is required');
    }
  }

  addModel() {
    /*    const  model = (this.baseFormField.getChildbyPath(this.path) as FormFieldArray).model;
    const  modelForm = this.formFieldsService.convertFormFieldsToAbstractControl(model);
    (this.formFieldsService.getAbstractControlByPath(this.form, this.path) as FormArray).push(modelForm);*/
  }
}
