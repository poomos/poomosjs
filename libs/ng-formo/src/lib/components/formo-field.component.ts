import {
  AfterViewInit,
  Component,
  HostBinding,
  Input,
  OnInit,
} from '@angular/core';
import * as _ from 'lodash';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { FormoField } from '../models/formo-field';
import { FormoFieldTypes } from '../interfaces/formo-field.interface';

@Component({ template: '' })
export abstract class BaseFormoFieldComponent implements OnInit, AfterViewInit {
  separatorKeysCodes: number[] = [ENTER, COMMA];
  @Input() field: FormoField<any, any, any, any>;
  @Input() extra: any = {};
  types = FormoFieldTypes;
  @Input() dynamicLabel: string;
  @HostBinding('class') get panelClass() {
    let panelClass = this.field.config.panelClass;
    if (!this.field.config.visible) {
      panelClass = panelClass + ' ' + 'd-none';
    }
    return panelClass;
  }

  constructor() {}

  ngOnInit() {
    if (this.field === null || this.field === undefined) {
      throw new TypeError('The input ‘Form’ is required');
    }
  }

  ngAfterViewInit() {}

  getErrors() {
    return this.field.control.errors;
  }

  get control() {
    return this.field.control;
  }

  isValid() {
    return this.field.control.valid;
  }

  get label() {
    if (this.dynamicLabel) {
      return this.dynamicLabel;
    } else {
      return this.field.config.label;
    }
  }

  hasError(validationType: string = null): boolean {
    if (this.getErrors() === {}) {
      return false;
    }
    return this.getErrors()[validationType];
  }

  compareFn(c1: any, c2: any): boolean {
    if (c1 && c2) {
      if (c1['id'] || c2['id']) {
        return _.get(c1, 'id') === _.get(c2, 'id');
      } else {
        return c1 === c2;
      }
    } else {
      return c1 === c2;
    }
  }

  getChoiceLabel(value: any): any {
    if (this.field.config.choiceLabel) {
      return _.get(value, this.field.config.choiceLabel);
    }
    return value;
  }

  getChoiceValue(value: any): any {
    if (this.field.config.choiceValue) {
      return _.get(value, this.field.config.choiceValue);
    }
    return value;
  }
}
