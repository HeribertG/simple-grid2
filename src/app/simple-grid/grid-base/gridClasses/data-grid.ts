import { GridCell, HeaderCell } from "./grid-cell";

export class GridData {
 

 
    private rowsNumber = 100;
    private colsNumber = 100;
    constructor() {}
  
    
  
    resetRowsNumber(value: number): void {
      this.rowsNumber = value;
    }
  
    
    getItem(row: number, col: number): GridCell {
      const c = new GridCell();
  
      c.mainText = 'Zelle ' + row.toString() + ' / ' + col.toString();
      c.secondSubText = row.toString() + ' / ' + col.toString();

      
      return c;
    }
  
    getHeaderItem( col: number) :HeaderCell{
      const c = new HeaderCell();
      c.titel = 'Kollone '   + col.toString();

      return c;
    }

    get rows(): number {
      return this.rowsNumber;
    }
  
    get columns(): number {
      return this.colsNumber;
    }
  
  
  }
  