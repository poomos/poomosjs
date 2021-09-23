import { Component, HostBinding, Input, OnInit } from '@angular/core';
import { FormoGroup } from '../group/formo-group';
import { FormoGroupTypes } from '../group/formo-group.interface';

export abstract class BaseFormoGroupComponent implements OnInit {
  @Input() group: FormoGroup<any, any, any, any>;
  types = FormoGroupTypes;

  @HostBinding('class') get panelClass() {
    let panelClass = this.group.panelClass;
    if (!this.group.visible) {
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
    return this.group.label;
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
