import { HostBinding, Input, OnInit } from '@angular/core';
import { FormoGroup } from '../models/formo-group';
import { FormoGroupTypes } from '../interfaces/config/formo-group-config';


export abstract class BaseFormoGroupComponent implements OnInit {
  @Input() group: FormoGroup<any, any, any, any>;
  types = FormoGroupTypes;

  @HostBinding('class') get panelClass() {
    let panelClass = this.group.config.panelClass;
    if (!this.group.config.visible) {
      panelClass = panelClass + ' ' + 'd-none';
    }
    return panelClass;
  }
  ngOnInit() {
    if (this.group === null || this.group === undefined) {
      throw new TypeError('The Input ‘group’ is required');
    }
  }

  get control() {
    return this.group.control;
  }

  get label() {
    return this.group.config.label;
  }

  get valid() {
    return this.group.control.valid;
  }

  get touched() {
    return this.group.control.touched;
  }

  get dirty() {
    return this.group.control.dirty;
  }
}
