import { Injectable, OnInit } from '@angular/core';
import { ClipboardModeEnum, WeekDaysEnum } from '../../helpers/enums/grid-settings.enum';

@Injectable({
  providedIn: 'root'
})
export class GridSettingsService {
  fixRows = 1;
  // tslint:disable-next-line:variable-name
  private _zoom = 1;

  increaseBorder = (0.5) ;
  cellHeight = 50 * this._zoom;
  cellWidth = 90 * this._zoom;
  mainTextHeight = 23 * this._zoom;
  firstSubTextHeight = 12 * this._zoom;
  secondSubTextHeight = 12 * this._zoom;
  cellHeaderHeight = 30 * this._zoom;
  font = 'normal ' + 12 * this._zoom + 'px Arial';
  subFont = 'normal ' + 10 * this._zoom + 'px Arial';
  rowHeaderIconWith = 20;
  rowHeaderIconHeight = 20;


  backGroundColor = '#FFFFFF';
  backGroundColorSaturday = 'Beige';
  backGroundColorSunday = 'BlanchedAlmond';
  backGroundColorHolyday = '#e6ffe6';
  backGroundColorOfficiallyHolyday = '#ffffe6';

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

  constructor() {
    this.weekday[0] = 'So';
    this.weekday[1] = 'Mo';
    this.weekday[2] = 'Di';
    this.weekday[3] = 'Mi';
    this.weekday[4] = 'Do';
    this.weekday[5] = 'Fr';
    this.weekday[6] = 'Sa';

    this.monthsName[0] = 'Jan';
    this.monthsName[1] = 'Feb';
    this.monthsName[2] = 'Mär';
    this.monthsName[3] = 'Apr';
    this.monthsName[4] = 'Mai';
    this.monthsName[5] = 'Jun';
    this.monthsName[6] = 'Jul';
    this.monthsName[7] = 'Aug';
    this.monthsName[8] = 'Sep';
    this.monthsName[9] = 'Okt';
    this.monthsName[10] = 'Nov';
    this.monthsName[1] = 'Dec';

  }

/* #region zoom affected sizes */

  get zoom(): number {
    return this._zoom;
  }
  set zoom(value: number) {
    this._zoom = value;
    this.reset();
  }

  reset() {
    this.increaseBorder = (0.5) ;
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
    return this._lastPixelRatio;
  }
  set lastPixelRatio(value: number) {
    this._lastPixelRatio = value;

  }

  /* #endregion zoom affected sizes */


  setEmptyBackground(weekday: WeekDaysEnum) {
    if (weekday === WeekDaysEnum.Saturday) {
      return this.backGroundColorSaturday;
    }

    if (weekday === WeekDaysEnum.Sunday) {
      return this.backGroundColorSunday;
    }

    return this.backGroundColor;
  }
}
