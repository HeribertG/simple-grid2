import { AfterViewInit, Component, Input, NgZone, OnDestroy, OnInit, Renderer2 } from '@angular/core';
import { MDraw } from '../../helpers/draw-helper';
import { MenuIDEnum } from '../../helpers/enums/cell-settings.enum';
import { ContextMenu } from '../gridClasses/context-menu';
import { CreateCell } from '../gridClasses/create-cell';
import { CreateHeader } from '../gridClasses/create-header';
import { GridData } from '../gridClasses/data-grid';
import { GridCellContextMenu } from '../gridClasses/grid-cell-context-menu';
import { GridCellManipulation } from '../gridClasses/grid-cell-manipulation';
import { GridSetting } from '../gridClasses/grid-setting';
import { Position } from '../gridClasses/position';
import { HScrollbarComponent } from '../h-scrollbar/h-scrollbar.component';
import { ScrollGridService } from '../services/scroll-grid.service';
import { VScrollbarComponent } from '../v-scrollbar/v-scrollbar.component';


@Component({
  selector: 'app-grid-body',
  templateUrl: './grid-body.component.html',
  styleUrls: ['./grid-body.component.scss']
})
export class GridBodyComponent implements OnInit, AfterViewInit, OnDestroy {


  private cellManipulation: GridCellManipulation | undefined | null;
  private gridCellContextMenu: GridCellContextMenu | undefined | null;
  private createCell: CreateCell | undefined | null;
  private createHeader: CreateHeader | undefined | null;
  resizeWindow: (() => void) | undefined;
  visibilitychangeWindow: (() => void) | undefined;



  public isFocused = true;
  public isBusy = false;
  public subMenus: ContextMenu[] | undefined | null;
  private ctx: CanvasRenderingContext2D | undefined | null;
  private renderCanvasCtx: CanvasRenderingContext2D | undefined | null;
  private canvas: HTMLCanvasElement | undefined | null;
  private renderCanvas: HTMLCanvasElement | undefined | null;
  private headerCtx: CanvasRenderingContext2D | undefined | null;
  private headerCanvas: HTMLCanvasElement | undefined | null;
  private tooltip: HTMLDivElement | undefined | null;


  contextMenuPosition = { x: '0px', y: '0px' };

  @Input() gridData: GridData | undefined | null;
  @Input() gridSetting: GridSetting | undefined | null

  @Input() vScrollbar: VScrollbarComponent | undefined | null;
  @Input() hScrollbar: HScrollbarComponent | undefined | null;


  constructor(
    private zone: NgZone,
    private scrollGrid: ScrollGridService,
    private renderer: Renderer2,
  ) { }

  ngOnInit() {

    this.resizeWindow = this.renderer.listen('window', 'resize', (event) => {
      this.resize(event);
    });

    this.visibilitychangeWindow = this.renderer.listen('window', 'visibilitychange', (event) => {
      this.visibilityChange(event);
    });

    this.canvas! = document.getElementById('gridCanvas') as HTMLCanvasElement;


    this.canvas! = document.getElementById('gridCanvas') as HTMLCanvasElement;
    this.renderCanvas! = document.createElement('canvas') as HTMLCanvasElement;
    this.headerCanvas! = document.createElement('canvas') as HTMLCanvasElement;

    this.ctx! = this.canvas!.getContext('2d') as CanvasRenderingContext2D;
    MDraw.createHiDPICanvas(this.ctx!);
    MDraw.setAntiAliasing(this.ctx!);
    this.ctx!.imageSmoothingQuality = 'high';


    this.renderCanvasCtx = this.renderCanvas!.getContext(
      '2d'
    ) as CanvasRenderingContext2D;
    MDraw.createHiDPICanvas(this.renderCanvasCtx!);
    MDraw.setAntiAliasing(this.renderCanvasCtx!);
    this.renderCanvasCtx.imageSmoothingQuality = 'high';

    this.headerCtx = this.headerCanvas!.getContext(
      '2d'
    ) as CanvasRenderingContext2D;
    MDraw.createHiDPICanvas(this.headerCtx!);
    MDraw.setAntiAliasing(this.headerCtx!);
    this.headerCtx.imageSmoothingQuality = 'high';

    this.tooltip = document.getElementById('tooltip') as HTMLDivElement;

  }

  ngAfterViewInit() {
    this.cellManipulation = new GridCellManipulation(this.gridSetting!);
    this.gridCellContextMenu = new GridCellContextMenu(this.gridData!);
    this.createCell = new CreateCell(this.gridSetting!, this.gridData!);
    this.createHeader = new CreateHeader(this.gridSetting!, this.gridData!);
    this.init();

  }

  ngOnDestroy(): void {

    if (this.resizeWindow) { this.resizeWindow(); }
    if (this.visibilitychangeWindow) { this.visibilitychangeWindow(); }

    this.gridCellContextMenu!.destroy();
    this.gridCellContextMenu = null;
    this.cellManipulation!.destroy();
    this.cellManipulation = null;
    this.createCell!.destroy();
    this.createCell = null;


    this.gridData = null;
    this.ctx = null;
    this.canvas = null;
    this.renderCanvas = null;
    this.headerCanvas = null;
    this.tooltip = null;
  }


  init(): void {
    const tmpDate = new Date(Date.now());
    const d = new Date(tmpDate.getFullYear(), tmpDate.getMonth(), 1);
    this.setMetrics();

    this.vScrollbar!.init();
    this.vScrollbar!.init();

    this.drawHeader();
    this.drawGrid();
  }

  private resize = (event: any): void => {

    this.setMetrics();
    this.refreshGrid();
  }

  private visibilityChange = (event: any): void => {

  }

  changeZoom(value: number) {

    this.gridSetting!.zoom = Math.round(value * 10) / 10;

    this.setMetrics();
    this.vScrollbar!.init();
    this.vScrollbar!.init();

    this.drawHeader();
    this.drawGrid();
    this.canvas!.focus();

  }

  changeLine(value: number): void {
    this.position = new Position(0, 0);
    this.scrollGrid.resetScrollPosition();
    this.setMetrics();
    this.vScrollbar!.init();
    this.vScrollbar!.init();

    this.drawHeader();
    this.drawGrid();
  }


  refreshGrid(): void {

    this.canvas!.height = this.canvas!.clientHeight;
    this.canvas!.width = this.canvas!.clientWidth;


    const visibleRow: number = Math.ceil(
      this.canvas!.clientHeight / this.gridSetting!.cellHeight
    );
    const visibleCol: number = Math.ceil(
      this.canvas!.clientWidth / this.gridSetting!.cellWidth
    );
    const height = visibleRow * this.gridSetting!.cellHeight;
    const width = visibleCol * this.gridSetting!.cellWidth;

    if (this.renderCanvas!.width < width || this.renderCanvas!.height < height) {
      this.onGrowGrid();
    } else {
      this.renderGrid();
    }
  }

  private renderGrid(): void {
    this.ctx!.drawImage(this.renderCanvas!, 0, 0, this.renderCanvas!.width, this.renderCanvas!.height,
      0, this.gridSetting!.cellHeaderHeight, this.renderCanvas!.width, this.renderCanvas!.height);

    let col: number = this.scrollGrid.hScrollValue;
    if (col < 0) {
      col = 0;
    }

    let cols = this.gridData?.columns as number;
    if (!cols) { cols = 1; }
    const width = this.gridData?.columns as number * this.gridSetting!.cellWidth;

    this.ctx!.drawImage(
      this.headerCanvas!,
      col * -1 * this.gridSetting!.cellWidth,
      0,
    );

    if (
      this.haspositionCollection &&
      this.cellManipulation!.positionCollection.count() > 1
    ) {
      this.drawSelection();
    } else {
      this.drawSelectedHeaderCell();
      this.drawSelectedCell();
    }
  }

  private setMetrics() {
    this.gridSetting?.reset();

    const visibleRows: number =
      Math.floor(this.canvas!.clientHeight / this.gridSetting!.cellHeight) - 1;
    const visibleCols: number =
      Math.floor(this.canvas!.clientWidth / this.gridSetting!.cellWidth) - 1;
    this.scrollGrid.setMetrics(
      visibleCols,
      this.gridData!.columns,
      visibleRows,
      this.gridData!.rows
    );
  }

  onGrowGrid() {
    const oldVisibleRow: number = Math.ceil(
      this.renderCanvas!.clientHeight / this.gridSetting!.cellHeight
    );
    const oldVisibleCol: number = Math.ceil(
      this.renderCanvas!.clientWidth / this.gridSetting!.cellWidth
    );

    const visibleRow: number = Math.ceil(
      this.canvas!.clientHeight / this.gridSetting!.cellHeight
    );
    const visibleCol: number = Math.ceil(
      this.canvas!.clientWidth / this.gridSetting!.cellWidth
    );
    const height = visibleRow * this.gridSetting!.cellHeight;
    const width = visibleCol * this.gridSetting!.cellWidth;

    this.renderCanvas!.height = height;
    this.renderCanvas!.width = width;

    for (let row = oldVisibleRow; row < visibleRow; row++) {
      for (let col = oldVisibleCol; col < visibleCol; col++) {
        this.addCells(row, col);
      }
    }

    // this.refreshGrid();
  }

  onShrinkGrid() {
    const visibleRow: number = Math.ceil(
      this.canvas!.clientHeight / this.gridSetting!.cellHeight
    );
    const visibleCol: number = Math.ceil(
      this.canvas!.clientWidth / this.gridSetting!.cellWidth
    );
    const height = visibleRow * this.gridSetting!.cellHeight;
    const width = visibleCol * this.gridSetting!.cellWidth;

    this.renderCanvas!.height = height;
    this.renderCanvas!.width = width;

    // this.refreshGrid();
  }

  refreshCell(pos: Position) {
    if (pos != null) {
      if (!pos.isEmpty()) {
        let col: number =
          (pos.column - this.scrollGrid.hScrollValue) *
          this.gridSetting!.cellWidth;
        let row: number =
          (pos.row - this.scrollGrid.vScrollValue) *
          this.gridSetting!.cellHeight;

        col -= 4;
        row -= 4;

        if (row < 0) {
          row = 0;
        }
        if (col < 0) {
          col = 0;
        }

        const tmpImage: ImageData | null | undefined = this.renderCanvasCtx!.getImageData(
          col,
          row,
          this.gridSetting!.cellWidth + 8,
          this.gridSetting!.cellHeight + 12
        );
        this.ctx!.putImageData(
          tmpImage,
          col,
          row + this.gridSetting!.cellHeaderHeight
        );

      }
    }
  }

  moveGrid(directionX: number, directionY: number): void {
    const dirX = directionX;
    const dirY = directionY;

    const visibleCol = Math.ceil(
      this.canvas!.clientWidth / this.gridSetting!.cellWidth
    );
    const visibleRow = Math.ceil(
      this.canvas!.clientHeight / this.gridSetting!.cellHeight
    );

    this.scrollGrid.hScrollValue += dirX;
    this.scrollGrid.vScrollValue += dirY;

    this.zone.run(() => {
      try {
        this.isBusy = true;
        // horizontale Verschiebung
        if (dirX !== 0) {


          if (dirX > 0) {
            if (dirX < visibleCol / 2) {
              this.moveIt(dirX, dirY);
              return;
            } else {
              this.drawGrid();
              return;
            }
          }
          if (dirX < 0) {
            if (dirX * -1 < visibleCol / 2) {
              this.moveIt(dirX, dirY);
              return;
            } else {
              this.drawGrid();
              return;
            }
          }
        }
        // vertikale Verschiebung
        if (dirY !== 0) {

          // Nach Unten
          if (dirY > 0) {

            if (dirY < visibleRow / 2) {
              this.moveIt(dirX, dirY);
              return;
            } else {
              this.drawGrid();
              return;
            }
          }
          // Nach Oben
          if (dirY < 0) {
            if (dirY * -1 < visibleRow / 2) {
              this.moveIt(dirX, dirY);
              return;
            } else {
              this.drawGrid();
            }
          }
        }
      } finally {
        this.isBusy = false;
      }
    });
  }

  private moveIt(directionX: number, directionY: number) {
    const visibleRow: number = Math.ceil(
      this.canvas!.clientHeight / this.gridSetting!.cellHeight
    );
    const visibleCol: number = Math.ceil(
      this.canvas!.clientWidth / this.gridSetting!.cellWidth
    );

    if (directionX !== 0) {

      this.vScrollbar!.value = this.scrollGrid.hScrollValue;

      const diff = this.scrollGrid.lastDifferenceX;
      if (diff === 0) {
        return;
      }

      const tempCanvas: HTMLCanvasElement = document.createElement(
        'canvas'
      ) as HTMLCanvasElement;
      tempCanvas.height = this.renderCanvas!.height;
      tempCanvas.width = this.renderCanvas!.width;

      const ctx = tempCanvas.getContext('2d');
      ctx!.drawImage(this.renderCanvas!, 0, 0);

      this.renderCanvas!.height = visibleRow * this.gridSetting!.cellHeight;
      this.renderCanvas!.width = visibleCol * this.gridSetting!.cellWidth;

      this.renderCanvasCtx!.clearRect(
        0,
        0,
        this.renderCanvas!.width,
        this.renderCanvas!.height
      );
      this.renderCanvasCtx!.drawImage(
        tempCanvas,
        this.gridSetting!.cellWidth * diff,
        0
      );

      let firstCol = 0;
      let lastCol = 0;

      if (directionX > 0) {
        firstCol = visibleCol + diff;
        lastCol = visibleCol + diff * -1 + 1;
      } else {
        firstCol = 0;
        lastCol = diff + 1;
      }

      for (let row = 0; row < visibleRow; row++) {
        for (let col = firstCol; col < lastCol; col++) {
          this.addCells(row, col);
        }
      }
    }

    if (directionY !== 0) {

      this.vScrollbar!.value = this.scrollGrid.vScrollValue;

      const diff = this.scrollGrid.lastDifferenceY;
      if (diff === 0) {
        return;
      }



      const tempCanvas: HTMLCanvasElement = document.createElement(
        'canvas'
      ) as HTMLCanvasElement;
      tempCanvas.height = this.renderCanvas!.height;
      tempCanvas.width = this.renderCanvas!.width;

      const ctx = tempCanvas.getContext('2d');
      ctx!.drawImage(this.renderCanvas!, 0, 0);

      this.renderCanvas!.height = visibleRow * this.gridSetting!.cellHeight;
      this.renderCanvas!.width = visibleCol * this.gridSetting!.cellWidth;

      this.renderCanvasCtx!.clearRect(
        0,
        0,
        this.renderCanvas!.width,
        this.renderCanvas!.height
      );
      this.renderCanvasCtx!.drawImage(
        tempCanvas,
        0,
        this.gridSetting!.cellHeight * diff
      );

      let firstRow = 0;
      let lastRow = 0;

      if (directionY > 0) {
        firstRow = visibleRow + diff;
        lastRow = visibleRow + diff * -1 + 1;
      } else {
        firstRow = 0;
        lastRow = diff + 1;
      }

      for (let row = firstRow; row < lastRow; row++) {
        for (let col = 0; col < visibleCol; col++) {
          this.addCells(row, col);
        }
      }
    }

    this.refreshGrid();
  }

  drawHeader() {

    const width: number = this.gridData!.columns * this.gridSetting!.cellWidth;
    this.headerCanvas!.height =  this.gridSetting!.cellHeaderHeight + this.gridSetting!.increaseBorder;
    this.headerCanvas!.width = width;

    const sourceWidth = this.gridSetting!.cellWidthWithHtmlZoom;
    const sourceHeight = this.gridSetting!.cellHeaderHeightWithHtmlZoom;
    const destinationWidth = this.gridSetting!.cellWidth;
    const destinationHeight = this.gridSetting!.cellHeaderHeight;

    for (let col = 0; col < this.gridData!.columns; col++) {
      const imgHeader = this.createHeader!.createHeader(col);
      if (imgHeader) {
        if (col < this.gridData!.columns) {
          this.headerCtx!.drawImage(
            imgHeader,
            0,0,sourceWidth,sourceHeight,
            col * this.gridSetting!.cellWidth,
            0,destinationWidth,destinationHeight

          );
        }
      }
    }
  }

  drawGrid() {

    this.vScrollbar!.refresh();
    this.vScrollbar!.refresh();

    const visibleRow: number = Math.ceil(
      this.canvas!.clientHeight / this.gridSetting!.cellHeight
    );
    const visibleCol: number = Math.ceil(
      this.canvas!.clientWidth / this.gridSetting!.cellWidth
    );
    const height = visibleRow * this.gridSetting!.cellHeight;
    const width = visibleCol * this.gridSetting!.cellWidth;

    this.renderCanvas!.height = height;
    this.renderCanvas!.width = width;

    this.renderCanvasCtx!.clearRect(
      0,
      0,
      this.renderCanvas!.width,
      this.renderCanvas!.width
    );

    for (let row = 0; row < visibleRow; row++) {
      for (let col = 0; col < visibleCol; col++) {
        this.addCells(row, col);
      }
    }

    this.refreshGrid();
  }

  drawSelectedCell() {
    if (this.position != null && !this.position.isEmpty()) {
      this.ctx!.save();

      this.ctx!.rect(
        0,
        this.gridSetting!.cellHeaderHeight,
        this.canvas!.width,
        this.renderCanvas!.height - this.gridSetting!.cellHeaderHeight
      );

      this.ctx!.clip();

      if (this.isFocused) {
        this.ctx!.strokeStyle = this.gridSetting!.focusBorderColor;
        this.ctx!.setLineDash([0]);
      } else {
        this.ctx!.setLineDash([1, 2]);
        this.ctx!.strokeStyle = 'grey';
      }

      const col: number =
        (this.position.column - this.scrollGrid.hScrollValue) *
        this.gridSetting!.cellWidth;
      const row: number =
        (this.position.row - this.scrollGrid.vScrollValue) *
        this.gridSetting!.cellHeight +
        this.gridSetting!.cellHeaderHeight;

      this.ctx!.strokeRect(
        col - 1,
        row - 1,
        this.gridSetting!.cellWidth + 3,
        this.gridSetting!.cellHeight + 1
      );

      this.ctx!.restore();
    }
  }

  refreshHeaderCell(pos: Position): void {
    if (pos !== undefined) {
      if (!pos.isEmpty()) {
        const col: number =
          (pos.column - this.scrollGrid.hScrollValue) *
          this.gridSetting!.cellWidth;

        const tmpImage: ImageData = this.headerCtx!.getImageData(
          pos.column * this.gridSetting!.cellWidth,
          0,
          this.gridSetting!.cellWidth,
          this.gridSetting!.cellHeaderHeight
        );
        this.ctx!.putImageData(tmpImage, col, 0);

      }
    }
  }

  drawSelectedHeaderCell() {
    if (this.position != null) {
      if (!this.position.isEmpty()) {
        this.ctx!.save();

        this.ctx!.fillStyle = this.gridSetting!.focusBorderColor;

        this.ctx!.globalAlpha = 0.2;
        const col: number =
          (this.position.column - this.scrollGrid.hScrollValue) *
          this.gridSetting!.cellWidth;

        this.ctx!.fillRect(
          col,
          0,
          this.gridSetting!.cellWidth,
          this.gridSetting!.cellHeaderHeight
        );

        this.ctx!.restore();
      }
    }
  }

  private addCells(row: number, col: number) {

    const tmpRow: number = row + this.scrollGrid.vScrollValue;
    const tmpCol: number = col + this.scrollGrid.hScrollValue;
    const cellWidth = this.gridSetting!.cellWidth;
    const cellHeight = this.gridSetting!.cellHeight;
    const cellWidthWithHtmlZoom = this.gridSetting!.cellWidthWithHtmlZoom;
    const cellHeightWithHtmlZoom = this.gridSetting!.cellHeightWithHtmlZoom;

    if (tmpRow < this.gridData!.rows && tmpCol < this.gridData!.columns) {

      const result = this.createCell!.createCell(tmpRow, tmpCol);

      this.renderCanvasCtx!.drawImage(
        result[0],
        0,
        0,
        cellWidthWithHtmlZoom,
        cellHeightWithHtmlZoom,
        col * cellWidth,
        row * cellHeight,
        cellWidth,
        cellHeight

      );

    }
  }

  calcCorrectCoordinate(event: MouseEvent) {
    let row = -1;
    let col = -1;
    const rect = this.canvas!.getBoundingClientRect();
    const x: number = event.clientX - rect.left;
    const y: number = event.clientY - rect.top;

    if (y >= this.gridSetting!.cellHeaderHeight) {

      row =
        Math.floor(
          (y - this.gridSetting!.cellHeaderHeight) / this.gridSetting!.cellHeight
        ) + this.scrollGrid.vScrollValue;
      col =
        Math.floor(x / this.gridSetting!.cellWidth) + this.scrollGrid.hScrollValue;
    }

    return new Position(row, col);
  }

  /* #region position and selection */

  get position(): Position {
    return this.cellManipulation!.position!;
  }
  set position(pos: Position) {
    if (!this.isPositionValid(pos)) {
      return;
    }

    const oldPosition: Position | null | undefined = this.cellManipulation!.position;
    this.cellManipulation!.position = pos;

    this.refreshCell(oldPosition!);
    this.refreshHeaderCell(oldPosition!);



    this.drawSelectedHeaderCell();
    this.drawSelectedCell();
  }

  drawSelectionDynamically(pos: Position): void {
    if (this.position != null && !this.position.isEmpty()) {
      if (pos != null && !pos.isEmpty()) {
        this.ctx!.save();

        this.renderGrid();

        this.ctx!.rect(
          0,
          this.gridSetting!.cellHeaderHeight,
          this.canvas!.width,
          this.renderCanvas!.height - this.gridSetting!.cellHeaderHeight
        );

        this.ctx!.clip();

        this.ctx!.globalAlpha = 0.2;
        this.ctx!.fillStyle = this.gridSetting!.focusBorderColor;

        const minCol: number =
          this.position.column < pos.column ? this.position.column : pos.column;
        let maxCol: number =
          this.position.column > pos.column ? this.position.column : pos.column;
        const minRow: number =
          this.position.row < pos.row ? this.position.row : pos.row;
        let maxRow: number =
          this.position.row > pos.row ? this.position.row : pos.row;

        maxCol += 1;
        maxRow += 1;

        if (maxCol > this.gridData!.columns) {
          maxCol = this.gridData!.columns;
        }
        if (maxRow > this.gridData!.rows) {
          maxRow = this.gridData!.rows;
        }

        this.drawRange(minCol, maxCol, minRow, maxRow);
        this.ctx!.restore();
      }
    }
  }

  private drawRange(
    minCol: number,
    maxCol: number,
    minRow: number,
    maxRow: number
  ): void {
    let col: number =
      (minCol - this.scrollGrid.hScrollValue) * this.gridSetting!.cellWidth;
    let row: number =
      (minRow - this.scrollGrid.vScrollValue) * this.gridSetting!.cellHeight +
      this.gridSetting!.cellHeaderHeight;
    if (col < 0) {
      col = 0;
    }
    if (row < this.gridSetting!.cellHeaderHeight) {
      row = this.gridSetting!.cellHeaderHeight;
    }

    let lastCol: number =
      (maxCol - this.scrollGrid.hScrollValue) * this.gridSetting!.cellWidth;
    let lastRow: number =
      (maxRow - this.scrollGrid.vScrollValue) * this.gridSetting!.cellHeight +
      this.gridSetting!.cellHeaderHeight;

    if (lastCol > this.canvas!.width) {
      lastCol = this.canvas!.width;
    }
    if (lastRow > this.canvas!.height) {
      lastRow = this.canvas!.height;
    }

    const width = lastCol - col;
    const height = lastRow - row;

    this.ctx!.fillRect(col, row, width, height);
  }

  private drawSelectedCellBackground(col: number, row: number): void {
    const column: number =
      (col - this.scrollGrid.hScrollValue) * this.gridSetting!.cellWidth;
    const rowset: number =
      (row - this.scrollGrid.vScrollValue) * this.gridSetting!.cellHeight +
      this.gridSetting!.cellHeaderHeight;

    this.ctx!.fillRect(
      column,
      rowset,
      this.gridSetting!.cellWidth,
      this.gridSetting!.cellHeight
    );
  }

  drawSelection() {
    this.ctx!.save();

    this.ctx!.rect(
      0,
      this.gridSetting!.cellHeaderHeight,
      this.canvas!.width,
      this.renderCanvas!.height - this.gridSetting!.cellHeaderHeight
    );

    this.ctx!.clip();

    this.ctx!.globalAlpha = 0.2;
    this.ctx!.fillStyle = this.gridSetting!.focusBorderColor;

    for (let i = 0; i < this.cellManipulation!.positionCollection.count(); i++) {
      const pos = this.cellManipulation!.positionCollection.item(i);
      this.drawSelectedCellBackground(pos.column, pos.row);
    }

    this.ctx!.restore();
  }

  createSelection(pos: Position): void {
    const minCol: number =
      this.position.column < pos.column ? this.position.column : pos.column;
    let maxCol: number =
      this.position.column > pos.column ? this.position.column : pos.column;
    const minRow: number =
      this.position.row < pos.row ? this.position.row : pos.row;
    let maxRow: number =
      this.position.row > pos.row ? this.position.row : pos.row;

    maxCol += 1;
    maxRow += 1;

    this.cellManipulation!.positionCollection.clear();

    for (let row = minRow; row < maxRow; row++) {
      for (let col = minCol; col < maxCol; col++) {
        this.cellManipulation!.positionCollection.add(
          new Position(row, col)
        );
      }
    }
  }

  destroySelection() {
    this.cellManipulation!.positionCollection.clear();
    this.renderGrid();
  }

  get haspositionCollection(): boolean {
    return this.cellManipulation!.positionCollection.count() > 0;
  }

  isPositionValid(pos: Position): boolean {
    if (pos === undefined || pos.isEmpty()) {
      return false;
    }
    if (pos.column < 0 || pos.column >= this.gridData!.columns) {
      return false;
    }
    if (pos.row < 0 || pos.row >= this.gridData!.rows) {
      return false;
    }

    return true;
  }

  /* #endregion position and selection */

  /* #region ToolTips */
  showToolTip({ value, event }: { value: any; event: MouseEvent }) {
    if (this.tooltip!.innerHTML !== value) {
      this.tooltip!.innerHTML = value;
      this.tooltip!.style.top = event.clientY + 'px';
      this.tooltip!.style.left = event.clientX + 'px';
      this.fadeInToolTip();
    }
  }

  hideToolTip() {
    // if ((this.tooltip.style.display = "none") && (this.tooltip.innerHTML != ''))
    //   this.tooltip.innerHTML == '';

    const op: number = Number.parseFloat(this.tooltip!.style.opacity);
    if (Number.isNaN(op)) {
      return;
    }
    if (op >= 0.9) {
      this.fadeOutToolTip();
    }
  }

  private fadeInToolTip() {
    let op = 0.1;
    this.tooltip!.style.display = 'block';
    const that = this;

    let timer = setInterval(function () {
      if (op >= 0.9) {
        clearInterval(timer);
        // this.tooltip!.style.opacity = 1;
        // this.toolTipDelayTimer = setInterval(function() {
        //   clearInterval(this.toolTipDelayTimer);
        //   that.fadeOutToolTipSlow();
        // }, 1000);
      }
      //  this.tooltip!.style.opacity = op;
      op += op * 0.1;
    }, 20);
  }

  private fadeOutToolTipSlow() {
    let op = 1;

    const timer = setInterval(function () {
      if (op <= 0.1) {
        clearInterval(timer);
        // that.tooltip!.style.opacity = 0;
        // that.tooltip.style.display = 'none';
        // that.tooltip.style.top = '-9000px';
        // that.tooltip.style.left = '-9000px';
      }
      //this.tooltip.style.opacity = op;
      op -= op * 0.1;
    }, 100);
  }

  private fadeOutToolTip() {
    let op = 1;

    // const timer = setInterval(function() {
    //   if (op <= 0.1) {
    //     clearInterval(timer);
    //     this.tooltip.style.opacity = 0;
    //     this.tooltip.style.display = 'none';
    //     this.tooltip.innerHTML = '';
    //     this.tooltip.style.top = '-9000px';
    //     this.tooltip.style.left = '-9000px';
    //   }
    //   this.tooltip.style.opacity = op;
    //   op -= op * 0.1;
    // }, 50);
  }

  destroyToolTip() {
    this.tooltip!.style.opacity = '0';
    this.tooltip!.style.display = 'none';
    this.tooltip!.innerHTML = '';
    this.tooltip!.style.top = '-9000px';
    this.tooltip!.style.left = '-9000px';
  }
  /* #endregion ToolTips */

  /* #region context menu */

  showContextMenu(event: MouseEvent) {
    this.clearMenus();

    const pos: Position = this.calcCorrectCoordinate(event);

    if (!this.cellManipulation!.isPositionInSelection(pos)) {
      this.destroySelection();
      this.position = pos;
    }

    this.subMenus = this.gridCellContextMenu!.createContextMenu(pos);
    this.contextMenuPosition.x = event.clientX + 'px';
    this.contextMenuPosition.y = event.clientY + 'px';
    // this.contextMenu.menuData = this.subMenus;

    // this.contextMenu.openMenu();
  }
  onContextMenuAction(event: ContextMenu) {
    switch (event.id) {
      case MenuIDEnum.emCopy: {
        this.cellManipulation!.copy();
        break;
      }
      case MenuIDEnum.emCut: {
        break;
      }
      case MenuIDEnum.emPaste: {
        break;
      }
    }
  }

  clearMenus() {
    this.subMenus = [];
  }
}
