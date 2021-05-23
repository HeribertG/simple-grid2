import {
  Directive,
  HostListener,
  Inject,
  ViewContainerRef,
  NgZone,
  } from '@angular/core';


import { Position } from '../../gridClasses/position';
import { GridBodyComponent } from '../grid-body.component';
import { ScrollGridService } from '../../services/scroll-grid.service';
import { GridSettingsService } from '../../services/grid-settings.service';
import { GridCellManipulationService } from '../../services/grid-cell-manipulation.service';


@Directive({
  // tslint:disable-next-line: directive-selector
  selector: '[klacksCellEvents]'
})
export class CellEventsDirective {
  private keyDown = false;
  private scrollByKey = false;
  private isDrawing = false;
  private hasCollection = false;
  private lastZoom=0;

  constructor(
    private zone: NgZone,
    private gridBody: GridBodyComponent,
    public viewContainerRef: ViewContainerRef,
    @Inject(ScrollGridService) private scrollGrid: ScrollGridService,
    @Inject(GridSettingsService) private gridSetting: GridSettingsService,
    @Inject(GridCellManipulationService)
    private cellManipulation: GridCellManipulationService
  ) {}

  @HostListener('mouseenter', ['$event']) onMouseEnter(event: MouseEvent) {}

  @HostListener('mouseleave', ['$event']) onMouseLeave(event: MouseEvent) {
    this.gridBody.destroyToolTip();
  }

  @HostListener('mousewheel', ['$event']) onMouseWheel(
    event: WheelEvent
  ): void {
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
  }

  @HostListener('mouseup', ['$event']) onMouseUp(event: MouseEvent): void {
    this.isDrawing = false;

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

      // if (col < this.gridData.columns && col >= 0) {
      //   const holiday: holidayDate = this.gridData.holidayInfo(col);
      //   if (holiday !== undefined) {
      //     const holidayName: string = holiday.currentName;
      //     this.gridBody.showToolTip({ value: holidayName, event });
      //     return;
      //   }
      // }
      this.gridBody.hideToolTip();
    }
  }

  @HostListener('window:keydown', ['$event']) onKeyDown(
    event: KeyboardEvent
  ): void {
    this.keyDown = true;

    const isShift: boolean = event.shiftKey;
    const isCtrl = event.ctrlKey;

    if (event.key === 'ArrowDown') {
      if (event.repeat) {
        if (this.gridBody.isBusy) {
          event.preventDefault();
          return;
        }
      }

      if (this.gridBody.position.row < this.gridData.rows) {
        this.gridBody.position = new Position(
          this.gridBody.position.row + 1,
          this.gridBody.position.column
        );

        if (this.scrollGrid.maxRows <= 1) {
          this.scrollGrid.vScrollValue = 0;
        } else {
          if (
            this.scrollGrid.vScrollValue + this.scrollGrid.visibleRows - 1 <
            this.gridBody.position.row
          ) {
            this.gridBody.moveGrid(0, 1);
          }
        }
        event.preventDefault();
        return;
      }
    }

    if (event.key === 'PageDown') {
      if (event.repeat) {
        if (this.gridBody.isBusy) {
          event.preventDefault();
          return;
        }
      }

      let nextVisibleRow: number =
        this.scrollGrid.vScrollValue + this.scrollGrid.visibleRows - 1;

      if (nextVisibleRow > this.gridData.rows) {
        nextVisibleRow = this.gridData.rows - 1;
      }

      if (this.scrollGrid.maxRows <= 1) {
        this.scrollGrid.vScrollValue = 0;
      } else if (this.scrollGrid.maxRows >= nextVisibleRow) {
        this.scrollGrid.vScrollValue = nextVisibleRow;
      } else {
        this.scrollGrid.vScrollValue = this.scrollGrid.maxRows;
      }

      this.gridBody.position = new Position(
        nextVisibleRow,
        this.gridBody.position.column
      );

      this.gridBody.drawGrid();
      event.preventDefault();
      return;
    }

    if (event.key === 'ArrowUp') {
      if (event.repeat) {
        if (this.gridBody.isBusy) {
          event.preventDefault();
          return;
        }
      }

      if (this.gridBody.position.row > 0) {


        const tmpRow: number = this.gridBody.position.row - 1;

        this.gridBody.position = new Position(
          tmpRow,
          this.gridBody.position.column
        );

        if (this.scrollGrid.maxRows <= 1) {
          this.scrollGrid.vScrollValue = 0;
        } else {
          if (this.scrollGrid.vScrollValue > this.gridBody.position.row) {
            this.gridBody.moveGrid(0, -1);
          }
        }
        event.preventDefault();
        return;
      }
    }

    if (event.key === 'PageUp') {

      if (event.repeat) {
        if (this.gridBody.isBusy) {
          event.preventDefault();
          return;
        }
      }

      let previousVisibleRow: number =
        this.scrollGrid.vScrollValue - this.scrollGrid.visibleRows + 1;

      if (previousVisibleRow < 0) {
        previousVisibleRow = 0;
      }

      if (this.scrollGrid.maxRows <= 1) {
        this.scrollGrid.vScrollValue = 0;
      } else {
        this.scrollGrid.vScrollValue = previousVisibleRow;
      }

      this.gridBody.position = new Position(
        previousVisibleRow,
        this.gridBody.position.column
      );

      this.gridBody.drawGrid();
      event.preventDefault();
      return;
    }

    if (event.key === 'End') {

      if (event.repeat) {
        // const isOkToWrite :boolean = event
        if (this.gridBody.isBusy) {
          event.preventDefault();
          return;
        }
      }

      if (this.scrollGrid.maxRows <= 1) {
        this.scrollGrid.vScrollValue = 0;
      } else {
        this.scrollGrid.vScrollValue = this.scrollGrid.maxRows;
      }

      this.gridBody.position = new Position(
        this.gridData.rows - 1,
        this.gridBody.position.column
      );

      this.gridBody.drawGrid();
      event.preventDefault();
      return;
    }

    if (event.key === 'Home') {

      if (event.repeat) {
        if (this.gridBody.isBusy) {
          event.preventDefault();
          return;
        }
      }

      this.scrollGrid.vScrollValue = 0;

      this.gridBody.position = new Position(
        0,
        this.gridBody.position.column
      );

      this.gridBody.drawGrid();
      event.preventDefault();
      return;
    }

    if (event.key === 'ArrowLeft' || event.key === 'Backspace') {
      if (event.repeat) {
        if (this.gridBody.isBusy) {
          event.preventDefault();
          return;
        }
      }

      if (this.gridBody.position.column > 0) {
        const previousColumn: number = this.gridBody.position.column - 1;
        this.gridBody.position = new Position(
          this.gridBody.position.row,
          previousColumn
        );

        if (this.gridBody.position.column < this.scrollGrid.hScrollValue) {
          this.gridBody.moveGrid(-1, 0);
        }
      }
      event.preventDefault();
      return;
    }

    if (event.key === 'ArrowRight' || event.key === 'Tab') {

      if (event.repeat) {
        if (this.gridBody.isBusy) {
          event.preventDefault();
          return;
        }
      }

      if (this.gridBody.position.column < this.gridData.columns - 1) {
        const nextColumn: number = this.gridBody.position.column + 1;

        this.gridBody.position = new Position(
          this.gridBody.position.row,
          nextColumn
        );

        if (
          this.gridBody.position.column >
          this.scrollGrid.hScrollValue + this.scrollGrid.visibleCols
        ) {
          this.gridBody.moveGrid(1, 0);
        }
      }
      event.preventDefault();
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
      this.cellManipulation.copy();
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
  }

  @HostListener('window:keypress', ['$event']) onKeyPress(
    event: KeyboardEvent
  ): void {}

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

  scrollOnPoint(pos: Position) {
    if (pos.column < this.scrollGrid.hScrollValue) {
      this.gridBody.moveGrid(-1, 0);
      return;
    }

    const lastVisibleColum =
      this.scrollGrid.visibleCols + this.scrollGrid.hScrollValue;

    if (pos.column > lastVisibleColum) {
      this.gridBody.moveGrid(1, 0);
      return;
    }

    if (pos.row < this.scrollGrid.vScrollValue) {
      this.gridBody.moveGrid(0, -1);
      return;
    }

    const lastVisibleRow =
      this.scrollGrid.visibleRows + this.scrollGrid.vScrollValue;

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
}
