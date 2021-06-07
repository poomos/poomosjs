export enum DialogResponseTypes {
  Create = '[Core] Dialog Response Create Type',
  Update = '[Core] Dialog Response Update Type',
  Refresh = '[Core] Dialog Response Refresh Type',
  Remove = '[Core] Dialog Response Remove Type',
  Cancel = '[Core] Dialog Response Cancel Type',
}

export interface IDialogResponse<T> {
  type: DialogResponseTypes;
  resource?: T;
}
