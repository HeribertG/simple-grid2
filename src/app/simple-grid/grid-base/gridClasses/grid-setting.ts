import { ClipboardModeEnum } from "../../helpers/enums/grid-settings.enum";

export class GridSetting {
  fixRows = 1;
  // tslint:disable-next-line:variable-name
  private _zoom = 1;

  increaseBorder = (0.5);
  cellHeight = 50 * this.zoom;
  cellWidth = 90 * this.zoom;
  mainTextHeight = 23 * this.zoom;
  firstSubTextHeight = 12 * this.zoom;
  secondSubTextHeight = 12 * this.zoom;
  cellHeaderHeight = 30 * this.zoom;
  font = 'normal ' + 12 * this.zoom + 'px Arial';
  subFont = 'normal ' + 10 * this.zoom + 'px Arial';
  rowHeaderIconWith = 20;
  rowHeaderIconHeight = 20;


  backGroundColor = '#FFFFFF';


  borderColor = '#999999';

  mainFontColor = '#000000';
  subFontColor = '#404040';

  foreGroundColor = '#000000';
  // controlBackGroundColor: string = '#D8BFD8';
  // headerBackGroundColor = '#f2f2f2';
  headerBackGroundColor = '#FFFFFF';
  headerForeGroundColor = '#4d4d4d';

  focusBorderColor = '#1E90FF';


  weekday = new Array(7);
  monthsName = new Array(12);

  clipboardMode: ClipboardModeEnum = ClipboardModeEnum.All;
  // tslint:disable-next-line:variable-name
  private _lastPixelRatio = 1;


  /* #region zoom affected sizes */

  get zoom(): number {
    return this._zoom;
  }
  set zoom(value: number) {
    this._zoom = value;
    this.reset();
  }

  reset() {
    this.increaseBorder = (0.5);
    this.cellHeight = Math.round(50 * this.zoom);
    this.cellWidth = Math.round(90 * this.zoom);
    this.mainTextHeight = Math.round(23 * this.zoom);
    this.firstSubTextHeight = Math.round(12 * this.zoom);
    this.secondSubTextHeight = Math.round(12 * this.zoom);
    this.cellHeaderHeight = Math.round(30 * this.zoom);
    const fontsize = Math.round((12 * this.zoom) * 10) / 10;
    this.font = 'normal ' + fontsize + 'px Arial';
    const subFontsize = Math.round((10 * this.zoom) * 10) / 10;
    this.subFont = 'normal ' + subFontsize + 'px Arial';
  }


  get lastPixelRatio(): number {
    return this._lastPixelRatio ;
  }
  set lastPixelRatio(value: number) {
    this._lastPixelRatio = value;

  }

  /* #endregion zoom affected sizes */

}
