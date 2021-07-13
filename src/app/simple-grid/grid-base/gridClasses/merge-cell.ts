import { Position } from "./position";

export interface IMergeCell {
  position: Position;
  colSpan: number;
  rowSpan: number;

}

export class MergeCell implements IMergeCell {
  position!: Position;
  colSpan = 0;
  rowSpan = 0;


}

export class MergeCellCollection {
  private items!: Array<IMergeCell>;

  constructor() {
    this.items! = [];
  }

  count(): number {
    return this.items.length;
  }

  add(value: IMergeCell): void {
    this.items.push(value);
  }

  item(index: number): IMergeCell {
    return this.items[index];
  }

  itemByColRow(col: Number, row: Number): IMergeCell | undefined {
    return this.items.find(x => 
      ((x.position.column <= col && (x.position.column + x.colSpan)>col ) && 
      (x.position.row <= row &&  (x.position.row + x.rowSpan)>row )));
  }

 
  clear(): void {
    if (this.items !== undefined) {
      this.items = [];
    }
  }

  minColumn(): number {
    return this.items.reduce((min, p) => p.position.column < min ? p.position.column : min, this.items[0].position.column);
  }
  maxColumn(): number {
    return this.items.reduce((max, p) => p.position.column > max ? p.position.column : max, this.items[0].position.column);
  }
  minRow(): number {
    return this.items.reduce((min, p) => p.position.row < min ? p.position.row : min, this.items[0].position.row);
  }
  maxRow(): number {
    return this.items.reduce((max, p) => p.position.row > max ? p.position.row : max, this.items[0].position.row);
  }

  containsByPosition(value: Position): boolean {
    return this.items.find(x => (x.position.column === value.column && x.position.row === value.row)) !== undefined;
  }

  contains(col: Number, row: Number): boolean {
    return this.items.find(x => (x.position.column === col && x.position.row === row)) !== undefined;
  }
}
