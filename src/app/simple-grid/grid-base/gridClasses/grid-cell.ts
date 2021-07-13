
import { CellTypeEnum, TextAlignmentEnum } from "../../helpers/enums/cell-settings.enum";


export interface IGridCell {

  mainText: string;
  firstSubText: string;
  secondSubText: string;
  backgroundColor: string;
  colspan: number;
  rowSpan: number;
  originalCol: number;
  originalRow: number;
  frozen: boolean;
  confirmed: boolean;
  sealed: boolean;
  cellType: CellTypeEnum;
  mainTextAlignment: TextAlignmentEnum;
  subTextAlignment: TextAlignmentEnum;
}


export class GridCell implements IGridCell {

  mainText = '';
  firstSubText = '';
  secondSubText = '';
  backgroundColor = '';
  colspan = 0;
  rowSpan = 0;
  originalCol = -1;
  originalRow = -1;
  frozen = false;
  confirmed = false;
  sealed = false;
  cellType = CellTypeEnum.Standard;
  mainTextAlignment = TextAlignmentEnum.Center;
  subTextAlignment = TextAlignmentEnum.Center;

  isEmpty(): boolean {

    return (!this.mainText && !this.firstSubText && !this.secondSubText);
  }

  hasSubText(): boolean {
    return !(!this.firstSubText && !this.secondSubText);
  }

}

export interface IGridCellResult {
  colspan: number;
  rowSpan: number;
  originalCol: number;
  originalRow: number;
  cellHeightWithHtmlZoom: number;
  cellWidthWithHtmlZoom: number;
  mainTextHeightWithHtmlZoom: number;
  firstSubTextHeightWithHtmlZoom: number;
  secondSubTextHeightWithHtmlZoom: number;

}


export class GridCellResult implements IGridCellResult {
  colspan = 0;
  rowSpan = 0;
  originalCol = -1;
  originalRow = -1;
  cellHeightWithHtmlZoom = 0;
  cellWidthWithHtmlZoom = 0;
  mainTextHeightWithHtmlZoom = 0;
  firstSubTextHeightWithHtmlZoom = 0;
  secondSubTextHeightWithHtmlZoom = 0;

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
