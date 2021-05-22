import { Injectable, Inject } from '@angular/core';
import { GridCell } from '../gridClasses/grid-cell';
import { GridSettingsService } from './grid-settings.service';



@Injectable({
  providedIn: 'root'
})
export class GridDataService {
  public rowEmployeeIndex: Array<number> = new Array<number>();
  public indexEmployeeRow: Array<number> = new Array<number>();

 
  private rowsNumber = 100;
  constructor(
    @Inject(GridSettingsService) private gridSetting: GridSettingsService,
    // tslint:disable-next-line:no-shadowed-variable

  ) {}

  init(beginDate: Date): void {
    this.setMetrics();
    
  }

  resetRowsNumber(value: number): void {
    this.rowsNumber = value;
    this.setMetrics();
  }

  

  setMetrics(): void {
    this.rowEmployeeIndex = [];
    this.indexEmployeeRow = [];

    let count = 0;
    let index = -1;

  }

  getItem(row: number, col: number): GridCell {
    const c = new GridCell();

    return c;
  }

  isLastRow(row: number): boolean {
    const result = this.indexEmployeeRow.find(x => x === row + 1);
    return result === undefined ? false : true;
  }

  getItemMainText(row: number, col: number): string {
    return 'Zelle ' + (row * this.columns + col).toString();
  }


  get rows(): number {
    return this.rowEmployeeIndex.length;
  }

  get columns(): number {
    return 31;
  }


}
