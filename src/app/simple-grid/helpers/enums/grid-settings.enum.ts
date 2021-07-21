export enum WeekDaysEnum {Workday,Saturday,Sunday,Holyday, OfficiallyHolyday}

export enum EditableModeEnum {

 
  None = 0,
  F2Key = 1,
  DoubleClick = 2,
  SingleClick = 4,
  AnyKey = 8,
  Focus = 16,
  Default = DoubleClick | F2Key | AnyKey
}

export enum GridSelectionModeEnum {
  Cell = 1,
  Row = 2,
  CellCtrl = 3
}

export enum PositionStateEnum {
  None = 0,
  IsCtrl,
  IsShift
}

export enum SelectedCellTypeEnum {
  enCell,
  enLine
}

export enum ClipboardModeEnum {None,Copy,Cut,Paste,Delete,All}

