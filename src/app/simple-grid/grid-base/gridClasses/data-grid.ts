import { WeekDay } from "@angular/common";
import { WeekDaysEnum } from "../../helpers/enums/grid-settings.enum";
import { GridCell, HeaderCell } from "./grid-cell";
import { MergeCellCollection } from "./merge-cell";

export class GridData {

  weekday = new Array(7);
  monthsName = new Array(12);
  mergeCellCollection:MergeCellCollection = new MergeCellCollection();;

  startDate: Date;

  private rowsNumber = 100;
  private colsNumber = 100;

  backGroundColor = '#FFFFFF';
  backGroundColorSaturday = 'Beige';
  backGroundColorSunday = 'BlanchedAlmond';
  backGroundColorHolyday = '#e6ffe6';
  backGroundColorOfficiallyHolyday = '#ffffe6';

  constructor() {

    const tmpDate = new Date(Date.now());
    const d = new Date(tmpDate.getFullYear(), tmpDate.getMonth(), 1);
    this.startDate = d;

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





  resetRowsNumber(value: number): void {
    this.rowsNumber = value;
  }


  getItem(row: number, col: number): GridCell {
    const c = new GridCell();

    c.mainText = 'Zelle ' + row.toString() + ' / ' + col.toString();
    c.secondSubText = row.toString() + ' / ' + col.toString();

    c.backgroundColor = this.setEmptyBackground(this.getWeekday(col));


    return c;
  }

  getHeaderItem(col: number): HeaderCell {
    const c = new HeaderCell();

    const today: Date = new Date(this.startDate);
    today.setDate(today.getDate() + col);
    c.titel = this.formatDate(today);

    return c;
  }

  get rows(): number {
    return this.rowsNumber;
  }

  get columns(): number {
    return this.colsNumber;
  }

  setEmptyBackground(weekday: WeekDaysEnum) {
    if (weekday === WeekDaysEnum.Saturday) {
      return this.backGroundColorSaturday;
    }

    if (weekday === WeekDaysEnum.Sunday) {
      return this.backGroundColorSunday;
    }

    return this.backGroundColor;
  }

  getWeekday(column: number): WeekDaysEnum {
    const today: Date = new Date(this.startDate);
    today.setDate(today.getDate() + column);

    // const hd = this.holidayList.isHolyday(today);

    // if (hd > 0) {
    //   if (hd === 2) { return WeekDaysEnum.OfficiallyHolyday; }
    //   return WeekDaysEnum.Holyday;
    // }

    if (today.getDay() === WeekDay.Sunday) {
      return WeekDaysEnum.Sunday;
    } else if (today.getDay() === WeekDay.Saturday) {
      return WeekDaysEnum.Saturday;
    } else { return WeekDaysEnum.Workday; }
  }

  weekdayName(column: number) {


    const today: Date = new Date(this.startDate);
    today.setDate(today.getDate() + column);

    return this.weekday[today.getDay()];
  }

  private formatDate(date: Date) {

    const day = date.getDate();
    return this.weekday[date.getDay()] + ' ' + day + '. ' + this.monthsName[date.getMonth()] + '.';
  }
}
