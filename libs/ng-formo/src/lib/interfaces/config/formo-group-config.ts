import { FormoRoot } from '../../models/formo-root';
import { FormoGroup } from '../../models/formo-group';

export enum FormoGroupTypes {
  Classic = 'Classic',
  DateRange = 'DateRange',
}

export interface IFormoGroupConfig<
  TRoot extends FormoRoot<any>,
  TCurrent extends FormoGroup<any, any, string, any>,
  T = ReturnType<TCurrent['value']>
> {
  type?: FormoGroupTypes | string;
  value?: T;
  visible?: boolean;
  label?: string;
  panelClass?: string;
}
export class FormoGroupConfig<
  TRoot extends FormoRoot<any>,
  TCurrent extends FormoGroup<any, any, string, any>
> {
  type?: FormoGroupTypes | string;
  value: IFormoGroupConfig<TRoot, TCurrent>['value'];
  label: IFormoGroupConfig<TRoot, TCurrent>['label'];
  visible?: boolean;
  panelClass?: string;

  constructor(config: IFormoGroupConfig<TRoot, TCurrent>) {
    this.type = config.type || FormoGroupTypes.Classic;
    this.panelClass = config.panelClass || 'col-md-6';
    this.label = config.label;
    this.visible = config.visible === undefined ? true : config.visible;
  }
}

export interface IFormoGroupListeners<
  TRoot extends FormoRoot<any>,
  TCurrent extends FormoGroup<any, any, string, any>,
  TParent
> {
  formValueChanged?: (root: TRoot, current: TCurrent) => void;
}

export interface IFormoGroupValidation<
  TRoot extends FormoRoot<any>,
  C extends FormoGroup<any, any, string, any>
> {
  isRequired?: boolean;
}
