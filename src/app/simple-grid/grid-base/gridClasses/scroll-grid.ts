export class ScrollGrid {

    constructor() { }
  
    public maxCols = 0;
    public maxRows = 0;
    public rowPercent = 0;
    public colPercent = 0;
  
  
    // tslint:disable-next-line:variable-name
    private _vScrollValue = 0;
    // tslint:disable-next-line:variable-name
    private _hScrollValue = 0;
    // tslint:disable-next-line:variable-name
    private _lastDifferenceX = 0;
    // tslint:disable-next-line:variable-name
    private _lastDifferenceY = 0;
    // tslint:disable-next-line:variable-name
    private _visibleCols = 0;
    // tslint:disable-next-line:variable-name
    private _visibleRows = 0;
  
  
    set vScrollValue(value: number) {
  
      if (this._vScrollValue !== value) {
        let oldValue: number = this._vScrollValue;
        if (oldValue < 0) {
          oldValue = 0;
        }
  
        this._vScrollValue = value;
        if (this._vScrollValue < 0) {
          this._vScrollValue = 0;
        }
        if (this._vScrollValue > this.maxRows) {
          this._vScrollValue = this.maxRows;
        }
  
        if (oldValue !== undefined) {
          this.difference(oldValue, false);
        } else { this._lastDifferenceY = 0; }
      }
    }
  
    get vScrollValue() {
      return this._vScrollValue;
    }
  
    set hScrollValue(value: number) {
  
  
      if (this._hScrollValue !== value) {
        let oldValue: number = this._hScrollValue;
        if (oldValue < 0) {
          oldValue = 0;
        }
  
        this._hScrollValue = value;
        if (this._hScrollValue < 0) {
          this._hScrollValue = 0;
        }
        if (this._hScrollValue > this.maxCols) {
          this._hScrollValue = this.maxCols;
        }
  
        if (oldValue !== undefined) {
          this.difference(oldValue, true);
        } else { this._lastDifferenceX = value; }
      }
    }
  
    get hScrollValue() {
      return this._hScrollValue;
    }
  
    resetScrollPosition(): void {
      this._hScrollValue = 0;
      this._vScrollValue = 0;
    }
  
    private difference(oldValue: number, isHorizontal: boolean) {
  
      if (isHorizontal) {
        this._lastDifferenceX = oldValue - this._hScrollValue;
      } else {
        this._lastDifferenceY = oldValue - this._vScrollValue;
      }
    }
  
    get lastDifferenceX(): number {
      return this._lastDifferenceX;
    }
    get lastDifferenceY(): number {
      return this._lastDifferenceY;
    }
  
    get visibleCols(): number {
      return this._visibleCols;
    }
  
    get visibleRows(): number {
      return this._visibleRows;
    }
  
    setMetrics(visibleCols: number, cols: number, visibleRows: number, rows: number) {
  
      this.colPercent = 0;
      this.rowPercent = 0;
  
      this.maxCols = (cols - visibleCols) + 1;
      if (this.maxCols < 0) { this.maxCols = 0; }
  
      this.maxRows = (rows - visibleRows) + 1;
      if (this.maxRows < 0) { this.maxRows = 0; }
  
      if (this.maxRows > 0 && rows > 0) {
        this.rowPercent = (rows / this.maxRows);
      }
  
      if (this.maxCols > 0 && cols > 0) {
        this.colPercent = (cols / this.maxCols);
      }
  
      this._visibleCols = visibleCols;
      this._visibleRows = visibleRows;
  
    }
  
  
  }
  