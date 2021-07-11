import { CellTypeEnum, TextAlignmentEnum } from "../../helpers/enums/cell-settings.enum";


export interface IGridCell {

  mainText: string | null;
  firstSubText: string | null;
  secondSubText: string | null;
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
    return !( !this.firstSubText && !this.secondSubText);
  }

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

    return (!this.titel )
  }

  
}
