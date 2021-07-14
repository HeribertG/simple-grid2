import { MDraw } from "../../helpers/draw-helper";
import { ClipboardModeEnum } from "../../helpers/enums/grid-settings.enum";

export class GridSetting {
  fixRows = 1;
  // tslint:disable-next-line:variable-name
  private _zoom = 1;
  // tslint:disable-next-line:variable-name
  private _cellHeight = 50;
  // tslint:disable-next-line:variable-name
  private _cellWidth = 90;
  // tslint:disable-next-line:variable-name
  private _mainTextHeight = 23;
  mainFontSize = 12;

  cellPadding = 3;

  // tslint:disable-next-line:variable-name
  private _firstSubTextHeight = 12;
  firstSubFontSize = 10;
  // tslint:disable-next-line:variable-name
  private _secondSubTextHeight = 12;
  secondSubFontSize = 10;

  increaseBorder = (0.5);
  cellHeight = this._cellHeight * this.zoom;
  cellWidth = this._cellWidth * this.zoom;
  mainTextHeight = this._mainTextHeight * this.zoom;
  firstSubTextHeight = this._firstSubTextHeight * this.zoom;
  secondSubTextHeight = this._secondSubTextHeight * this.zoom;
  cellHeaderHeight = 30 * this.zoom;
  font = 'normal ' + this.mainFontSize * this.zoom + 'px Arial';
  firstSubFontFont = 'normal ' + this.firstSubFontSize * this.zoom + 'px Arial';

  cellHeightWithHtmlZoom = this._cellHeight * this.zoom;
  cellWidthWithHtmlZoom = this._cellWidth * this.zoom;
  mainTextHeightWithHtmlZoom = this._mainTextHeight * this.zoom;
  mainFontSizeHtmlZoom = this.mainFontSize * this.zoom;
  firstSubFontSizeHtmlZoom = this.firstSubFontSize * this.zoom;
  secondSubFontSizeHtmlZoom = this.secondSubFontSize * this.zoom;
  firstSubTextHeightWithHtmlZoom = this._firstSubTextHeight * this.zoom;
  secondSubTextHeightWithHtmlZoom = this._firstSubTextHeight * this.zoom;
  cellHeaderHeightWithHtmlZoom = 30 * this.zoom;
  fontWithHtmlZoom = 'normal ' + this.mainFontSize * this.zoom + 'px Arial';
  subFontWithHtmlZoom = 'normal ' + this.firstSubFontSize * this.zoom + 'px Arial';
  subFontsizeithHtmlZoom = Math.round((this._firstSubTextHeight * this.htmlZoom) * this.firstSubFontSize) / this.firstSubFontSize;
  increaseBorderHtmlZoom = (0.5 * this.zoom);

  rowHeaderIconWith = 20;
  rowHeaderIconHeight = 20;


  backGroundColor = '#FFFFFF';


  borderColor = '#999999';

  mainFontColor = '#000000';
  subFontColor = '#404040';

  foreGroundColor = '#000000';
  controlBackGroundColor: string = '#F4F6F6';
  // headerBackGroundColor = '#f2f2f2';
  headerBackGroundColor = '#FFFFFF';
  headerForeGroundColor = '#4d4d4d';

  focusBorderColor = '#1Ethis._cellWidthFF';


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

  get htmlZoom(): number {
    return this._zoom * MDraw.pixelRatio();
  }


  reset() {
    this.increaseBorder = (0.5);
    this.cellHeight = Math.round(this._cellHeight * this.zoom);
    this.cellWidth = Math.round(this._cellWidth * this.zoom);
    this.mainTextHeight = Math.round(this._mainTextHeight * this.zoom);
    this.firstSubTextHeight = Math.round(this._firstSubTextHeight * this.zoom);
    this.secondSubTextHeight = Math.round(this._firstSubTextHeight * this.zoom);
    this.cellHeaderHeight = Math.round(30 * this.zoom);
    const fontsize = Math.round((this.mainFontSize * this.zoom) * 10) / 10;
    this.font = 'normal ' + fontsize + 'px Arial';
    const firstSubFontSize = Math.round((this.firstSubFontSize * this.zoom) * 10) / 10;
    this.firstSubFontFont = 'normal ' + firstSubFontSize + 'px Arial';

    this.increaseBorderHtmlZoom = (0.5 * this.htmlZoom);
    this.cellHeightWithHtmlZoom = this._cellHeight * this.htmlZoom;
    this.cellWidthWithHtmlZoom = this._cellWidth * this.htmlZoom;
    this.mainTextHeightWithHtmlZoom = this._mainTextHeight * this.htmlZoom;
    this.firstSubTextHeightWithHtmlZoom = this._firstSubTextHeight * this.htmlZoom;
    this.secondSubTextHeightWithHtmlZoom = this._firstSubTextHeight * this.htmlZoom;
    this.cellHeaderHeightWithHtmlZoom = 30 * this.htmlZoom;
    this.mainFontSizeHtmlZoom = this.mainFontSize * this.htmlZoom;
    this.firstSubFontSizeHtmlZoom = this.firstSubFontSize * this.htmlZoom;
    this.fontWithHtmlZoom = 'normal ' + this.mainFontSize * this.htmlZoom + 'px Arial';
    this.subFontWithHtmlZoom = 'normal ' + this.firstSubFontSize * this.htmlZoom + 'px Arial'
    this.subFontsizeithHtmlZoom = Math.round((this._firstSubTextHeight * this.htmlZoom) * 10) / 10;

  }


  public get lastPixelRatio(): number {
    return this._lastPixelRatio;
  }
  public set lastPixelRatio(value: number) {

    if (this._lastPixelRatio !== value) {
      this._lastPixelRatio = value;
      this.reset();
    }


  }

  /* #endregion zoom affected sizes */

}
