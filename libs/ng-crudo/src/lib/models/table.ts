import { ICursorInfo } from '@lebonip/ts-common';
import { ICrudoListBulkAction, ICrudoListItemAction } from './list';

export enum TableFieldTypes {
  TEXT = 'TEXT',
  BOOLEAN = 'BOOLEAN',
  DYNAMIC_DISPLAY = 'DYNAMIC_DISPLAY',
}

export class ICrudoTableConfig<T> {
  selectionEnabled?: boolean;
  identifierPath?: string;
  loading?: boolean;
  fields?: ICrudoTableField[];
  itemActions?: ICrudoListItemAction<T>[] = [];
  bulkActions?: ICrudoListBulkAction<T>[] = [];
  cursorInfo?: ICursorInfo;

  /*  constructor(options: ICrudoTableField) {
    this.name = options.name;
    this.label = options.label || options.name;
    this.property = options.property || options.name;
    this.type = options.type || TableFieldTypes.TEXT;
    this.dynamicDisplay = options.dynamicDisplay || null;
  }*/
}

export const defaultPoomosTableConfig: ICrudoTableConfig<any> = {
  selectionEnabled: true,
  identifierPath: 'id',
  loading: false,
  fields: [],
  itemActions: [],
  cursorInfo: {
    startCursor: '',
    endCursor: '',
    hasNextPage: false,
    hasPreviousPage: false,
  },
};

export interface ICrudoTableField {
  name: string;
  label: string;
  property: string;
  type: TableFieldTypes;
  dynamicDisplay?: (data: any) => any;
}
export class CrudoTableField implements ICrudoTableField {
  name: string;
  label: string;
  property: string;
  type: TableFieldTypes;
  dynamicDisplay?: (data: any) => any;

  constructor(options: ICrudoTableField) {
    this.name = options.name;
    this.label = options.label || options.name;
    this.property = options.property || options.name;
    this.type = options.type || TableFieldTypes.TEXT;
    this.dynamicDisplay = options.dynamicDisplay || null;
  }
}
