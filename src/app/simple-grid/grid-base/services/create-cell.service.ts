import { Injectable, Inject } from '@angular/core';
import { GridSettingsService } from './grid-settings.service';
import { GridCell } from '../gridClasses/grid-cell';
import { MDraw } from '../../helpers/draw-helper';
import { BaselineAlignmentEnum, TextAlignmentEnum } from '../../helpers/enums/cell-settings.enum';


@Injectable({
  providedIn: 'root'
})
export class CreateCellService {

  private lastLine = 5;

  constructor(
    @Inject(GridSettingsService) private gridSetting: GridSettingsService,
  ) { }

  reset() {
    this.init();
  }
  private init() {

  
    const width = this.gridSetting.cellWidth + this.gridSetting.increaseBorder;
    const height =
      this.gridSetting.cellHeight + this.gridSetting.increaseBorder;
   
  }

  private createEmptyCanvas(
    backGroundColor: string,
    width: number,
    height: number,
    isLast: boolean = false
  ): HTMLCanvasElement {
    const tempCanvas: HTMLCanvasElement = document.createElement('canvas');
    const ctx: CanvasRenderingContext2D|null = tempCanvas.getContext('2d');
    MDraw.createHiDPICanvas(ctx!);
    tempCanvas.width = width;
    tempCanvas.height = height;

    this.fillEmptyCell(
      ctx!,
      backGroundColor,
      tempCanvas.width,
      tempCanvas.height,
      isLast
    );
    return tempCanvas;
  }
  private fillEmptyCell(
    ctx: CanvasRenderingContext2D,
    backGroundColor: string,
    width: number,
    height: number,
    isLast: boolean = false
  ): void {
    ctx.save();
    ctx.clearRect(0, 0, width, height);
    ctx.fillStyle = backGroundColor;
    ctx.fillRect(0, 0, width, height);
    this.drawSimpleBorder(ctx);

    if (isLast) {
      ctx.lineWidth = 2;
      ctx.strokeStyle = this.gridSetting.borderColor;
      ctx.moveTo(0, height);
      ctx.lineTo(width, height);

      ctx.stroke();
    }

    ctx.restore();
  }

  createCell(row: number, col: number): HTMLCanvasElement {
    const tempCanvas: HTMLCanvasElement = document.createElement(
      'canvas'
    ) as HTMLCanvasElement;
    const ctx = tempCanvas.getContext('2d');
      
    MDraw.createHiDPICanvas(ctx!);
       
      return tempCanvas;

  }

  private drawBorder(ctx: CanvasRenderingContext2D) {
    ctx.beginPath();
    ctx.strokeStyle = 'black';
    ctx.lineWidth = 1;

    ctx.moveTo(0, 0);
    ctx.lineTo(this.gridSetting.cellWidth, 0);
    ctx.lineTo(
      this.gridSetting.cellWidth,
      this.gridSetting.cellHeight + this.gridSetting.increaseBorder
    );
    ctx.lineTo(
      0,
      this.gridSetting.cellHeight + this.gridSetting.increaseBorder
    );
    ctx.lineTo(0, 0);
    ctx.stroke();
  }

  private drawMainText(ctx: CanvasRenderingContext2D, text: string) {
    MDraw.drawText(
      ctx,
      text,
      0,
      0,
      this.gridSetting.cellWidth,
      this.gridSetting.mainTextHeight,
      this.gridSetting.font,
      12,
      this.gridSetting.mainFontColor,
      TextAlignmentEnum.Center,
      BaselineAlignmentEnum.Center
    );
  }

  private drawFirstSubText(ctx: CanvasRenderingContext2D, text: string) {
    MDraw.drawText(
      ctx,
      text,
      0,
      this.gridSetting.mainTextHeight,
      this.gridSetting.cellWidth,
      this.gridSetting.firstSubTextHeight,
      this.gridSetting.subFont,
      10,
      this.gridSetting.subFontColor,
      TextAlignmentEnum.Center,
      BaselineAlignmentEnum.Center
    );
  }

  private drawSecondSubText(ctx: CanvasRenderingContext2D, text: string) {
    MDraw.drawText(
      ctx,
      text,
      0,
      this.gridSetting.mainTextHeight + this.gridSetting.firstSubTextHeight,
      this.gridSetting.cellWidth,
      this.gridSetting.secondSubTextHeight,
      this.gridSetting.subFont,
      10,
      this.gridSetting.subFontColor,
      TextAlignmentEnum.Left,
      BaselineAlignmentEnum.Center
    );
  }

  drawSimpleBorder(ctx: CanvasRenderingContext2D) {
    ctx.strokeStyle = this.gridSetting.borderColor;
    ctx.lineWidth = 0.5;
    ctx.strokeRect(
      0,
      0,
      this.gridSetting.cellWidth + this.gridSetting.increaseBorder,
      this.gridSetting.cellHeight + this.gridSetting.increaseBorder
    );
  }
}
