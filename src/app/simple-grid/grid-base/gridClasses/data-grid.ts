import { GridCell } from "./grid-cell";

export class GridData {
 

 
    private rowsNumber = 100;
    private colsNumber = 100;
    constructor() {}
  
    
  
    resetRowsNumber(value: number): void {
      this.rowsNumber = value;
    }
  
    
    getItem(row: number, col: number): GridCell {
      const c = new GridCell();
  
      return c;
    }
  
    
    get rows(): number {
      return this.rowsNumber;
    }
  
    get columns(): number {
      return this.colsNumber;
    }
  
  
  }
  