import {
  Directive,
  HostListener,
  ViewContainerRef,
  NgZone,
} from '@angular/core';


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
    public viewContainerRef: ViewContainerRef,

  ) { }

  @HostListener('mouseenter', ['$event']) onMouseEnter(event: MouseEvent) { }

  @HostListener('mouseleave', ['$event']) onMouseLeave(event: MouseEvent) {
    this.gridBody.destroyToolTip();
    this.gridBody.removeMenu();

  }

  @HostListener('mousewheel', ['$event']) onMouseWheel(
    event: WheelEvent
  ): void {
    this.gridBody.clearMenus();
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
    this.gridBody.removeMenu();
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
      this.gridBody.removeMenu();

    }
  }

  @HostListener('window:keydown', ['$event']) onKeyDown(
    event: KeyboardEvent
  ): void {
    this.keyDown = true;
    this.gridBody.removeMenu();


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

    // if (e.Key == Input.Key.Delete) {
    //   zDelete();
    //   e.Handled = true;
    //   p_KeyDown = false;
    //   return;
    // }

    // if (e.Key == Key.X && IsCtrl) {
    //   try {
    //     zCut();
    //     e.Handled = true;
    //     return;
    //   }
    //   catch (Exception ex)
    //   {
    //     Debug.Print("ucChildSimpleGrid.KeyDown: " + ex.Message);
    //   }
    // }
    // Copy
    if (event.key === 'c' && event.ctrlKey) {
      this.gridBody.cellManipulation!.copy();
      this.keyDown = false;

      return;
    }
    // // Paste
    // if (e.Key == Key.V && IsCtrl) {
    //   try {
    //     zPaste();
    //     e.Handled = true;
    //     return;
    //   }
    //   catch (Exception ex)
    //   {
    //     Debug.Print("ucChildSimpleGrid.KeyDown: " + ex.Message);
    //   }
    // }

    // if (!(e.Key == Key.C && IsCtrl)) {
    //   if (!(e.Key == Key.V && IsCtrl)) {
    //     if (!(e.Key == Key.X && IsCtrl)) {
    //       if (!IsCtrl) {
    //         if (IsEditable) {
    //           if (EditMode == enEditableMode.Default | EditMode == enEditableMode.AnyKey) {
    //             if (p_PositionCollection.Count == 0 || ((p_PositionCollection.First.Row == p_PositionCollection.Last.Row) && (p_PositionCollection.First.Column == p_PositionCollection.Last.Column))) {
    //               if (!(e.OriginalSource) is System.Windows.Controls.TextBox)
    //               {
    //                 if (p_LastSelectedPositionState == enPositionState.None)
    //                   zEditSelectedCell();
    //               }
    //             }
    //           }
    //         }
    //       }
    //     }
    //   }
    // }
    event.stopPropagation();
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
    this.gridBody.showContextMenu(event);
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
