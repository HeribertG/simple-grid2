
import { Component, Input, OnDestroy, OnInit, Renderer2 } from '@angular/core';
import { TextAlignmentEnum } from '../../helpers/enums/cell-settings.enum';
import { Rectangle } from '../../helpers/geometry';
import { GridData } from '../gridClasses/data-grid';
import { Position } from '../gridClasses/position';

@Component({
  selector: 'app-active-cell',
  templateUrl: './active-cell.component.html',
  styleUrls: ['./active-cell.component.scss']
})
export class ActiveCellComponent implements OnInit, OnDestroy {

  @Input() gridData: GridData | undefined | null;

  currentPosition: Position | undefined | null;
  cellValue = '';

  private cellInput: HTMLInputElement | undefined | null;

  constructor(private renderer: Renderer2,) { }

  ngOnInit(): void {
    this.cellInput = document.getElementById('edit-cell') as HTMLInputElement;
  }

  ngOnDestroy(): void {
    this.cellInput = undefined;
  }

  onMouseEnter(event: MouseEvent): void { this.stopEvent(event); }
  onMouseLeave(event: MouseEvent): void { this.stopEvent(event); }
  onMouseDown(event: MouseEvent): void { this.stopEvent(event); }
  onMouseClick(event: MouseEvent): void { this.stopEvent(event); }
  onMouseUp(event: MouseEvent): void { this.stopEvent(event); }
  onMouseMove(event: MouseEvent): void { this.stopEvent(event); }
  onKeyDown(event: KeyboardEvent): void {

    const target = event.target as HTMLInputElement;
    const carretStart = target.selectionStart;
    const carretEnd = target.selectionEnd;
    const textLenght = target.value.length;

    if (event.key === 'ArrowDown') {
      this.hideCell();
      return;
    }
    if (event.key === 'PageDown') {
      this.hideCell();
      return;
    }
    if (event.key === 'ArrowUp') {
      this.hideCell();
      return;
    }
    if (event.key === 'PageUp') {
      this.hideCell();
      return;
    }
    if (event.key === 'End') {
      this.hideCell();
      return;
    }
    if (event.key === 'Home') {
      this.hideCell();
      return;
    }
    if (event.key === 'Backspace') {
      this.hideCell();
      return;
    }
    if (event.key === 'Tab') {
      this.hideCell();
      return;
    }

    if (event.key === 'ArrowLeft') {
      if (carretStart === carretEnd && carretStart === 0) {
        this.hideCell();
        return;
      }

    }
    if (event.key === 'ArrowRight') {
      if (carretStart === carretEnd && carretEnd === textLenght) {
        this.hideCell();
        return;
      }
    }
    if (event.key === 'Enter') {
      this.hideCell();
      return;
    }

    this.stopEvent(event);
  }
  onKeyUp(event: KeyboardEvent): void { this.stopEvent(event); }
  onKeyPress(event: KeyboardEvent): void { this.stopEvent(event); }


  private stopEvent(event: any): void {
    if (event.stopPropagation)
      event.stopPropagation();

  }

  showCell(rect: Rectangle, pos: Position) {

    this.currentPosition = pos;

    this.formatCell();

    this.renderer.setStyle(this.cellInput!, 'top', rect.top + 'px');
    this.renderer.setStyle(this.cellInput!, 'left', rect.left + 'px');
    this.renderer.setStyle(this.cellInput!, 'width', rect.width + 'px');
    this.renderer.setStyle(this.cellInput!, 'height', rect.height + 'px');
    this.renderer.setStyle(this.cellInput!, 'display', 'block');
    this.renderer.setStyle(this.cellInput!, 'visibility', 'visible');

    this.cellInput!.focus()

  }

  hideCell() {

    this.renderer.setStyle(this.cellInput!, 'display', 'none');
    this.renderer.setStyle(this.cellInput!, 'visibility', 'hidden');

    this.currentPosition = undefined;
  }

  private formatCell() {
    const cell = this.gridData!.getItem(this.currentPosition!.row, this.currentPosition!.column);

    this.cellValue = cell.mainText;
    this.renderer.setStyle(this.cellInput!, 'background-color', cell.backgroundColor);
    this.renderer.setStyle(this.cellInput!, 'font', this.gridData!.gridSetting!.font);
    this.renderer.setStyle(this.cellInput!, 'color', this.gridData!.gridSetting!.mainFontColor);
    
    switch(cell.mainTextAlignment){
      case TextAlignmentEnum.Left:
        this.renderer.setStyle(this.cellInput!, 'text-align', 'left');
      break
      case TextAlignmentEnum.Center:
        this.renderer.setStyle(this.cellInput!, 'text-align', 'center');
      break
      case TextAlignmentEnum.Right:
        this.renderer.setStyle(this.cellInput!, 'text-align', 'right');
      break
    }
  
  }
}