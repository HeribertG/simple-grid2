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

  mainText = null;
  firstSubText = null;
  secondSubText = null;
  frozen = false;
  confirmed = false;
  sealed = false;
  cellType = CellTypeEnum.Standard;
  mainTextAlignment = TextAlignmentEnum.Center;
  subTextAlignment = TextAlignmentEnum.Center;

  isEmpty(): boolean {

    return (!this.mainText && !this.firstSubText && !this.secondSubText) ||
      (this.mainText === '' && this.firstSubText === '' && this.secondSubText === '');
  }

}
