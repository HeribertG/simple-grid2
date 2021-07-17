
import { BaselineAlignmentEnum, CellTypeEnum, TextAlignmentEnum } from "../../helpers/enums/cell-settings.enum";
import { IMergeCell } from "./merge-cell";


export interface IGridCell {

  mainText: string;
  firstSubText: string;
  secondSubText: string;
  backgroundColor: string;
  frozen: boolean;
  confirmed: boolean;
  sealed: boolean;
  cellType: CellTypeEnum;

  mainTextAlignment: TextAlignmentEnum;
  mainTextBaselineAlignment: BaselineAlignmentEnum;

  firstSubTextAlignment: TextAlignmentEnum;
  firstSubTextBaselineAlignment: BaselineAlignmentEnum;

  secondSubTextAlignment: TextAlignmentEnum;
  secondSubTextBaselineAlignment: BaselineAlignmentEnum;

  mainTextHeight: number;
  firstSubTextHeight: number;
  secondSubTextHeight: number;

  mainTextWidth: number;
  firstSubTextWidth: number;
  secondSubTextWidth: number;

}

export class GridCell implements IGridCell {

  mainText = '';
  firstSubText = '';
  secondSubText = '';
  backgroundColor = '';
  frozen = false;
  confirmed = false;
  sealed = false;
  cellType = CellTypeEnum.Standard;

  currentMergeCell: IMergeCell | undefined

  mainTextAlignment = TextAlignmentEnum.Center;
  mainTextBaselineAlignment = BaselineAlignmentEnum.Top;

  firstSubTextAlignment = TextAlignmentEnum.Center;
  firstSubTextBaselineAlignment = BaselineAlignmentEnum.Top;

  secondSubTextAlignment = TextAlignmentEnum.Center;
  secondSubTextBaselineAlignment = BaselineAlignmentEnum.Top;

  mainTextHeight = 0;
  firstSubTextHeight = 0;
  secondSubTextHeight = 0;

  mainTextWidth = 0;
  firstSubTextWidth = 0;
  secondSubTextWidth = 0;

  isEmpty(): boolean {

    return (!this.mainText && !this.firstSubText && !this.secondSubText);
  }

  hasSubText(): boolean {
    return !(!this.firstSubText && !this.secondSubText);
  }

}

export interface IGridCellResult {
  colSpan: number;
  rowSpan: number;
  originalCol: number;
  originalRow: number;
}

export class GridCellResult implements IGridCellResult {
  colSpan = 1;
  rowSpan = 1;
  originalCol = -1;
  originalRow = -1;
}
export interface IHeaderCell {

  titel: string | null;
  frozen: boolean;
  cellType: CellTypeEnum;
  mainTextAlignment: TextAlignmentEnum;
  subTextAlignment: TextAlignmentEnum;
}

export class HeaderCell implements IHeaderCell {


  titel = '';
  frozen = false;
  cellType = CellTypeEnum.Standard;
  mainTextAlignment = TextAlignmentEnum.Center;
  subTextAlignment = TextAlignmentEnum.Center;

  isEmpty(): boolean {

    return (!this.titel)
  }



}
