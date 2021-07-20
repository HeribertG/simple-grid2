import {
  Directive,
  HostListener,
  NgZone,
} from '@angular/core';
import { EditableModeEnum } from 'src/app/simple-grid/helpers/enums/grid-settings.enum';
import { Rectangle } from 'src/app/simple-grid/helpers/geometry';
import { Position } from '../../gridClasses/position';
import { GridBodyComponent } from '../grid-body.component';




@Directive({
  // tslint:disable-next-line: directive-selector
  selector: '[klacksCellEvents]'
})
export class CellEventsDirective {



  private keyDown = false;
  private scrollByKey = false;
  private isDrawing = false;
  private hasCollection = false;
  private lastZoom = 0;

  constructor(
    private zone: NgZone,
    private gridBody: GridBodyComponent,
  ) { }

  @HostListener('mouseenter', ['$event']) onMouseEnter(event: MouseEvent) { }

  @HostListener('mouseleave', ['$event']) onMouseLeave(event: MouseEvent) {
    this.gridBody.destroyToolTip();

    const rect = new Rectangle(this.gridBody.clientLeft, this.gridBody.clientTop, this.gridBody.clientWidth, this.gridBody.clientHeight);
    if (!rect.pointInRect(event.clientX, event.clientY)) {
      this.gridBody.simpleContextMenu!.removeMenu();
    }

  }

  @HostListener('mousewheel', ['$event']) onMouseWheel(
    event: WheelEvent
  ): void {
    this.gridBody.simpleContextMenu!.clearMenus();
    const moveY: number = event.deltaY === 0 ? 0 : event.deltaY > 0 ? 1 : -1;
    const moveX: number = event.deltaX === 0 ? 0 : event.deltaX > 0 ? 1 : -1;

    this.gridBody.moveGrid(moveX, moveY);
  }

  @HostListener('mousedown', ['$event']) onMouseDown(event: MouseEvent): void {
    if (event.buttons === 1) {
      this.respondToLeftMouseDown(event);
    } else if (event.buttons === 2) {
      this.respondToRightMouseDown(event);
    }

    this.stopEvent(event)
  }

  @HostListener('click', ['$event']) onMouseClick(event: MouseEvent): void {
    this.gridBody.simpleContextMenu!.removeMenu();
  }

  @HostListener('mouseup', ['$event']) onMouseUp(event: MouseEvent): void {
    this.isDrawing = false;

    this.stopEvent(event)

    if (this.hasCollection) {
      const pos: Position = this.gridBody.calcCorrectCoordinate(event);
      if (!this.gridBody.isPositionValid(pos)) {
        return;
      }

      this.gridBody.createSelection(pos);
    }

    this.hasCollection = false;


  }

  @HostListener('mousemove', ['$event']) onMouseMove(event: MouseEvent): void {
    if (event.buttons === 1 && this.isDrawing) {
      const pos: Position = this.gridBody.calcCorrectCoordinate(event);

      this.scrollOnPoint(pos);
      if (!this.gridBody.isPositionValid(pos)) {
        return;
      }

      this.gridBody.drawSelectionDynamically(pos);

      this.hasCollection = true;
    }

    if (event.buttons === 0) {
      const col: number = this.gridBody.calcCorrectCoordinate(event).column;

      // if (col < this.gridBody..gridBody.gridBody.gridData!.columns && col >= 0) {
      //   const holiday: holidayDate = this.gridBody..gridBody.gridBody.gridData!.holidayInfo(col);
      //   if (holiday !== undefined) {
      //     const holidayName: string = holiday.currentName;
      //     this.gridBody.showToolTip({ value: holidayName, event });
      //     return;
      //   }
      // }
      this.gridBody.hideToolTip();
      //  this.gridBody.simpleContextMenu!.removeMenu();

    }
  }

  @HostListener('window:keydown', ['$event']) onKeyDown(
    event: KeyboardEvent
  ): void {
    this.keyDown = true;
    this.gridBody.simpleContextMenu!.removeMenu();


    if (event.shiftKey) {
      this.gridBody.setShiftKey();
    }
    this.gridBody.isCtrl = event.ctrlKey;

    if (event.key === 'ArrowDown') {
      if (event.repeat) {
        if (this.gridBody.isBusy) {
          this.stopEvent(event)
          return;
        }
      }

      if (this.gridBody.position.row < this.gridBody.gridData!.rows) {
        this.gridBody.position = new Position(
          this.gridBody.position.row + 1,
          this.gridBody.position.column
        );

        if (this.gridBody.scrollGrid!.maxRows <= 1) {
          this.gridBody.scrollGrid!.vScrollValue = 0;
        } else {
          if (
            this.gridBody.scrollGrid!.vScrollValue + this.gridBody.scrollGrid!.visibleRows - 1 <
            this.gridBody.position.row
          ) {
            this.gridBody.moveGrid(0, 1);
          }
        }

        if (this.gridBody.isShift) {
          if (this.gridBody.AnchorKeyPosition) { this.gridBody.drawSelectionDynamically(this.gridBody.AnchorKeyPosition as Position); }
        }

        this.stopEvent(event)
        return;
      }
    }

    if (event.key === 'PageDown') {
      if (event.repeat) {
        if (this.gridBody.isBusy) {
          this.stopEvent(event)
          return;
        }
      }

      let nextVisibleRow: number =
        this.gridBody.scrollGrid!.vScrollValue + this.gridBody.scrollGrid!.visibleRows - 1;

      if (nextVisibleRow > this.gridBody.gridData!.rows) {
        nextVisibleRow = this.gridBody.gridData!.rows - 1;
      }

      if (this.gridBody.scrollGrid!.maxRows <= 1) {
        this.gridBody.scrollGrid!.vScrollValue = 0;
      } else if (this.gridBody.scrollGrid!.maxRows >= nextVisibleRow) {
        this.gridBody.scrollGrid!.vScrollValue = nextVisibleRow;
      } else {
        this.gridBody.scrollGrid!.vScrollValue = this.gridBody.scrollGrid!.maxRows;
      }

      this.gridBody.position = new Position(
        nextVisibleRow,
        this.gridBody.position.column
      );

      this.gridBody.drawGrid();
      this.stopEvent(event)
      return;
    }

    if (event.key === 'ArrowUp') {
      if (event.repeat) {
        if (this.gridBody.isBusy) {
          this.stopEvent(event)
          return;
        }
      }

      if (this.gridBody.position.row > 0) {


        const tmpRow: number = this.gridBody.position.row - 1;

        this.gridBody.position = new Position(
          tmpRow,
          this.gridBody.position.column
        );

        if (this.gridBody.scrollGrid!.maxRows <= 1) {
          this.gridBody.scrollGrid!.vScrollValue = 0;
        } else {
          if (this.gridBody.scrollGrid!.vScrollValue > this.gridBody.position.row) {
            this.gridBody.moveGrid(0, -1);
          }
        }

        if (this.gridBody.isShift) {
          if (this.gridBody.AnchorKeyPosition) { this.gridBody.drawSelectionDynamically(this.gridBody.AnchorKeyPosition as Position); }
        }

        this.stopEvent(event)
        return;
      }
    }

    if (event.key === 'PageUp') {

      if (event.repeat) {
        if (this.gridBody.isBusy) {
          this.stopEvent(event)
          return;
        }
      }

      let previousVisibleRow: number =
        this.gridBody.scrollGrid!.vScrollValue - this.gridBody.scrollGrid!.visibleRows + 1;

      if (previousVisibleRow < 0) {
        previousVisibleRow = 0;
      }

      if (this.gridBody.scrollGrid!.maxRows <= 1) {
        this.gridBody.scrollGrid!.vScrollValue = 0;
      } else {
        this.gridBody.scrollGrid!.vScrollValue = previousVisibleRow;
      }

      this.gridBody.position = new Position(
        previousVisibleRow,
        this.gridBody.position.column
      );

      this.gridBody.drawGrid();
      this.stopEvent(event)
      return;
    }

    if (event.key === 'End') {

      if (event.repeat) {
        // const isOkToWrite :boolean = event
        if (this.gridBody.isBusy) {
          this.stopEvent(event)
          return;
        }
      }

      if (this.gridBody.scrollGrid!.maxRows <= 1) {
        this.gridBody.scrollGrid!.vScrollValue = 0;
      } else {
        this.gridBody.scrollGrid!.vScrollValue = this.gridBody.scrollGrid!.maxRows;
      }

      this.gridBody.position = new Position(
        this.gridBody.gridData!.rows - 1,
        this.gridBody.position.column
      );

      this.gridBody.drawGrid();
      this.stopEvent(event);
      return;
    }

    if (event.key === 'Home') {

      if (event.repeat) {
        if (this.gridBody.isBusy) {
          this.stopEvent(event);
          return;
        }
      }

      this.gridBody.scrollGrid!.vScrollValue = 0;

      this.gridBody.position = new Position(
        0,
        this.gridBody.position.column
      );

      this.gridBody.drawGrid();
      this.stopEvent(event);
      return;
    }

    if (event.key === 'ArrowLeft' || event.key === 'Backspace') {
      if (event.repeat) {
        if (this.gridBody.isBusy) {
          this.stopEvent(event);
          return;
        }
      }

      if (this.gridBody.position.column > 0) {
        const previousColumn: number = this.gridBody.position.column - 1;
        this.gridBody.position = new Position(
          this.gridBody.position.row,
          previousColumn
        );

        if (this.gridBody.position.column < this.gridBody.scrollGrid!.hScrollValue) {
          this.gridBody.moveGrid(-1, 0);
        }
      }

      if (this.gridBody.isShift) {
        if (this.gridBody.AnchorKeyPosition) { this.gridBody.drawSelectionDynamically(this.gridBody.AnchorKeyPosition as Position); }
      }

      this.stopEvent(event);
      return;
    }

    if (event.key === 'ArrowRight' || event.key === 'Tab') {

      if (event.repeat) {
        if (this.gridBody.isBusy) {
          this.stopEvent(event);
          return;
        }
      }

      if (this.gridBody.position.column < this.gridBody.gridData!.columns - 1) {
        const nextColumn: number = this.gridBody.position.column + 1;

        this.gridBody.position = new Position(
          this.gridBody.position.row,
          nextColumn
        );

        if (
          this.gridBody.position.column >
          this.gridBody.scrollGrid!.hScrollValue + this.gridBody.scrollGrid!.visibleCols
        ) {
          this.gridBody.moveGrid(1, 0);
        }
      }

      if (this.gridBody.isShift) {
        if (this.gridBody.AnchorKeyPosition) { this.gridBody.drawSelectionDynamically(this.gridBody.AnchorKeyPosition as Position); }
      }

      this.stopEvent(event);
      return;
    }

    // Delete
    if (event.key === 'Delete') {

      this.keyDown = false;
      this.stopEvent(event);
      return;
    }

    // Cut
    if (event.key.toLocaleLowerCase() === 'x' && event.ctrlKey) {

      this.keyDown = false;
      this.stopEvent(event);
      return;
     
    }

    // Copy
    if (event.key === 'c' && event.ctrlKey) {
      this.gridBody.cellManipulation!.copy();
      this.keyDown = false;
      this.stopEvent(event);
      return;
    }

    // Paste
    if (event.key.toLocaleLowerCase() === 'v' && event.ctrlKey) {
      this.keyDown = false;
      this.stopEvent(event);
      return;
    }


    if (!event.ctrlKey) {
      if (this.gridBody.gridData!.gridSetting!.isEditabled) {
        const pos = this.gridBody.position;
        if (pos) {
          const mode = this.gridBody.gridData!.cellMode(pos.row, pos.column);
          if (mode == EditableModeEnum.Default || mode == EditableModeEnum.AnyKey) {

            if (this.gridBody.gridData!.cellMode(pos.row, pos.column) != EditableModeEnum.None) {
              if (this.gridBody.isActivCellVisible()) {
                // zEditSelectedCell();
              }

            }
          }
        }
      }
    }

  }

  @HostListener('window:keyup', ['$event']) onKeyUp(
    event: KeyboardEvent
  ): void {
    this.keyDown = false;
    this.scrollByKey = false;
    if (!event.shiftKey) {
      this.gridBody.unSetShiftKey();
    }
    this.gridBody.isCtrl = false;
  }

  @HostListener('window:keypress', ['$event']) onKeyPress(
    event: KeyboardEvent
  ): void { }

  @HostListener('window:focus', ['$event']) onfocus(event: FocusEvent): void {
    this.gridBody.isFocused = true;
    if (!this.gridBody.hasPositionCollection) {
      this.gridBody.refreshCell(this.gridBody.position);
      this.gridBody.drawSelectedCell();
    }
  }

  @HostListener('window:blur', ['$event']) onblur(event: FocusEvent): void {
    this.gridBody.isFocused = false;
    if (!this.gridBody.hasPositionCollection) {
      this.gridBody.refreshCell(this.gridBody.position);
      this.gridBody.drawSelectedCell();
    }
  }

  @HostListener('window:contextmenu', ['$event']) onContextMenu(event: any): void {
    this.stopEvent(event);
  }

  scrollOnPoint(pos: Position) {
    if (pos.column < this.gridBody.scrollGrid!.hScrollValue) {
      this.gridBody.moveGrid(-1, 0);
      return;
    }

    const lastVisibleColum =
      this.gridBody.scrollGrid!.visibleCols + this.gridBody.scrollGrid!.hScrollValue;

    if (pos.column > lastVisibleColum) {
      this.gridBody.moveGrid(1, 0);
      return;
    }

    if (pos.row < this.gridBody.scrollGrid!.vScrollValue) {
      this.gridBody.moveGrid(0, -1);
      return;
    }

    const lastVisibleRow =
      this.gridBody.scrollGrid!.visibleRows + this.gridBody.scrollGrid!.vScrollValue;

    if (pos.row >= lastVisibleRow) {
      this.gridBody.moveGrid(0, 1);
      return;
    }
  }

  private respondToLeftMouseDown(event: MouseEvent): void {
    this.gridBody.destroySelection();

    const pos: Position = this.gridBody.calcCorrectCoordinate(event);
    this.isDrawing = true;

    if (this.gridBody.position !== pos) {
      this.gridBody.position = pos;
    }
  }

  private respondToRightMouseDown(event: MouseEvent): void {
    this.gridBody.simpleContextMenu!.showContextMenu(event);
  }

  private stopEvent(event: any): void {
    if (event.preventDefault)
      event.preventDefault();
    if (event.stopPropagation)
      event.stopPropagation();
    if (event.cancelBubble)
      event.cancelBubble = true;
  }
}
