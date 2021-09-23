import {
  AfterViewInit,
  Component,
  HostBinding,
  Input,
  OnInit,
} from '@angular/core';
import * as _ from 'lodash';
import { FormoField } from '../field/formo-field';
import { FormoFieldTypes } from '../field/formo-field.type';
import { COMMA, ENTER } from '@angular/cdk/keycodes';

export abstract class BaseFormoFieldComponent implements OnInit, AfterViewInit {
  separatorKeysCodes: number[] = [ENTER, COMMA];
  @Input() field: FormoField<any, any, any, any>;
  @Input() extra: any = {};
  types = FormoFieldTypes;
  @Input() dynamicLabel: string;
  @HostBinding('class') get panelClass() {
    let panelClass = this.field.panelClass;
    if (!this.field.visible) {
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
    return this.field.valid;
  }

  get label() {
    if (this.dynamicLabel) {
      return this.dynamicLabel;
    } else {
      return this.field.label;
    }
  }

  get placeholder() {
    return this.field.placeholder;
  }

  get description() {
    return this.field.description;
  }

  get help() {
    return this.field.help;
  }
  hasError(validationType: string): boolean {
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
    if (this.field.choiceLabel) {
      return _.get(value, this.field.choiceLabel);
    }
    return value;
  }

  getChoiceValue(value: any): any {
    if (this.field.choiceValue) {
      return _.get(value, this.field.choiceValue);
    }
    return value;
  }
}
