import { AfterViewInit, Component, HostListener, Inject, Input, NgZone, OnDestroy, OnInit } from '@angular/core';
import { ScrollGridService } from '../services/scroll-grid.service';
import { GridBodyComponent } from '../grid-body/grid-body.component';
import { MDraw } from '../../helpers/draw-helper';
import { Gradient3DBorderStyleEnum } from '../../helpers/enums/draw.enum';

@Component({
  selector: 'app-v-scrollbar',
  templateUrl: './v-scrollbar.component.html',
  styleUrls: ['./v-scrollbar.component.scss']
})
export class VScrollbarComponent implements OnInit, AfterViewInit, OnDestroy {

  public maximumRow: number = 0;

  private ctx: CanvasRenderingContext2D | undefined | null;
  private canvas!: HTMLCanvasElement | undefined | null;
  // tslint:disable-next-line:variable-name
  private _scrollValue = 0;
  private thumbLength = 0;
  private tickSize = 0;
  private MouseEnterThumb = false;
  private MousePointThumb = false;
  private MouseYToThumbY = 0;
  private MouseOverThumb = false;
  private imgThumb: ImageData| undefined | null;
  private imgSelectedThumb: ImageData| undefined | null;
  public isDirty = false;
  private requestID :number| undefined | null;
  private moveAnimationValue = 0;

  @Input() gridBody: GridBodyComponent| undefined | null;

  constructor(
    private zone: NgZone,
    @Inject(ScrollGridService) private scrollGrid: ScrollGridService
  ) { }

  /* #region ng */

  ngOnInit() {
    this.canvas = document.getElementById('vScrollbar') as HTMLCanvasElement;
    this.ctx = this.canvas.getContext('2d') as CanvasRenderingContext2D;
  }

  ngAfterViewInit() {
    this.scrollTop = 0;
    this.refresh();
  }

  ngOnDestroy(): void {
    this.ctx = null;
    this.canvas = null;
    this.imgThumb = null;
    this.imgSelectedThumb = null;
  }

  /* #endregion ng */

  init() {
    this.scrollTop = 0;
    this.refresh();
  }

  // tslint:disable-next-line:variable-name
  private set scrollTop(_value: number) {
    if (this.isDirty) {
      return;
    }

    if (_value === undefined || Number.isNaN(_value)) {
      _value = 0;
    }

    if (this._scrollValue !== _value) {

      this._scrollValue = _value;

      let res: number = Math.ceil(this._scrollValue / this.tickSize);
      if (res === undefined || Number.isNaN(res)) {
        res = 0;
      }

      const diff: number = res - this.scrollGrid.vScrollValue;

      this.isDirty = true;
      if (diff !== 0) {
        this.gridBody!.moveGrid(0, diff);
      }

      this.isDirty = false;

    }
  }
  private get scrollTop(): number {
    let res: number = Math.ceil(this.scrollGrid.vScrollValue * this.tickSize);
    if (res === undefined || Number.isNaN(res)) {
      res = 0;
    }
    return res;
  }

  // tslint:disable-next-line:variable-name
  set value(_value: number) {
    if (_value === undefined || Number.isNaN(_value)) {
      _value = 0;
    }

    let res: number = Math.ceil(this.scrollGrid.vScrollValue * this.tickSize);
    if (res === undefined || Number.isNaN(res)) {
      res = 0;
    }

    this._scrollValue = res;

    this.reDraw();
  }
  get value(): number {
    return this.scrollGrid.vScrollValue;
  }

  refresh() {
    this.calcMetrics();
    this.reDraw();
  }

  private reDraw() {
    if (!this.scrollGrid) {
      return;
    }
    if (this.thumbLength === Infinity) {
      return;
    }
    if (this.tickSize === Infinity) {
      return;
    }

    if(this.canvas && this.ctx && this.imgSelectedThumb && this.imgThumb) {
      this.canvas.width = this.canvas.clientWidth;
      this.canvas.height = this.canvas.clientHeight;
  
      this.ctx.save();
  
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
  
      if (this.MouseOverThumb) {
        this.ctx.putImageData(this.imgSelectedThumb, 3, this.scrollTop);
      } else {
        this.ctx.putImageData(this.imgThumb, 3, this.scrollTop);
      }
      this.ctx.restore();
    }

  }

  private createThumb(): void {
    if (this.thumbLength === -Infinity) {
      return;
    }
    if (this.thumbLength === Infinity) {
      return;
    }

    this.imgThumb = null;
    this.imgSelectedThumb = null;

    const canvas = document.createElement('canvas') as HTMLCanvasElement;
    const ctx = canvas.getContext('2d') as CanvasRenderingContext2D;

    canvas.width = this.canvas!.clientWidth - 6;
    canvas.height = this.thumbLength;

    ctx.fillStyle = '#A9A9A9';

    ctx.fillRect(0, 0, canvas.width, canvas.height);

    this.imgThumb = ctx.getImageData(0, 0, canvas.width, canvas.height);

    MDraw.drawBorder(
      ctx,
      0,
      0,
      canvas.width,
      canvas.height,
      ctx.fillStyle,
      3,
      Gradient3DBorderStyleEnum.Raised
    );

    this.imgSelectedThumb = ctx.getImageData(0, 0, canvas.width, canvas.height);
  }

  private calcMetrics(): void {
    if (!this.scrollGrid) {
      return;
    }

    const h: number = this.canvas!.clientHeight;
    let moveZoneLength = h / this.scrollGrid.rowPercent;

    this.thumbLength = this.canvas!.clientHeight - moveZoneLength;


    if (this.thumbLength < 10) {
      this.thumbLength = 10;
      moveZoneLength -= 10;
    }

    this.tickSize = moveZoneLength / this.scrollGrid.maxRows;
    this.createThumb();
  }
  /* #region Events */

  @HostListener('click', ['$event']) onClick(event: MouseEvent): void { }

  @HostListener('mousedown', ['$event']) onMouseDown(event: MouseEvent): void {
    this.MouseEnterThumb = this.isMouseOverThumb(event);
    this.MouseOverThumb = this.MouseEnterThumb;

    if (this.MouseEnterThumb) {

    } else {
      if (event.clientY < this.scrollTop + this.canvas!.offsetTop) {
        this.moveAnimationValue = -1;
      } else {
        this.moveAnimationValue = 1;
      }
      this.moveAnimation();
    }
  }

  @HostListener('mouseup', ['$event']) onMouseUp(event: MouseEvent): void {
    this.MouseEnterThumb = false;
    this.MouseYToThumbY = 0;
    this.canvas!.onpointermove = null;
    this.stopMoveAnimation();
  }

  @HostListener('pointerdown', ['$event']) onPointerDown(
    event: PointerEvent
  ): void {

    if (this.isMouseOverThumb(event) && event.buttons === 1) {
      this.MousePointThumb = true;
      this.MouseYToThumbY = event.clientY - this.scrollTop;
      this.canvas!.setPointerCapture(event.pointerId);
    }
  }
  @HostListener('pointerup', ['$event']) onPointerUp(
    event: PointerEvent
  ): void {
    this.MousePointThumb = false;
    this.canvas!.releasePointerCapture(event.pointerId);
  }
  @HostListener('pointermove', ['$event']) onPointerMove(
    event: PointerEvent
  ): void {
    const y = event.clientY - this.MouseYToThumbY;
    this.zone.run(() => {
      if (this.MousePointThumb) {
        this.scrollTop = y;
      }
    });
  }

  @HostListener('mousemove', ['$event']) onMouseMove(event: MouseEvent): void {
    this.MouseOverThumb = this.isMouseOverThumb(event);

    this.refresh();
  }

  @HostListener('mouseleave', ['$event']) onMouseLeave(
    event: MouseEvent
  ): void {
    this.MouseOverThumb = false;
  }

  @HostListener('mouseenter', ['$event']) onMouseEnter(
    event: MouseEvent
  ): void {
    this.MouseOverThumb = this.isMouseOverThumb(event);
    this.refresh();
  }

  @HostListener('mouseover', ['$event']) onMouseOver(event: MouseEvent): void { }

  /* #endregion events */

  isMouseOverThumb(event: MouseEvent): boolean {
    const y: number = event.clientY - this.canvas!.offsetTop;

    if (y >= this.scrollTop && y <= this.scrollTop + this.thumbLength) {
      return true;
    }

    return false;
  }

  moveAnimation() {

    if (this.moveAnimationValue < 0) {
      this.gridBody!.moveGrid(0, -5);
    } else if (this.moveAnimationValue > 0) {
      this.gridBody!.moveGrid(0, 5);
    }

    this.requestID = window.requestAnimationFrame(x => {
      this.moveAnimation();
    });
  }
  stopMoveAnimation(): void {
    this.moveAnimationValue = 0;
    window.cancelAnimationFrame(this.requestID!);
  }
}
