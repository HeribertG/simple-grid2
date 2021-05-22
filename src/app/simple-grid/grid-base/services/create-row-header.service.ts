import { Injectable, Inject, NgZone } from '@angular/core';
import { GridSettingsService } from './grid-settings.service';
import { GridDataService } from './grid-data.service';
import { Gradient3DBorderStyleEnum } from 'src/app/helpers/enums/draw.enum';
import {
  TextAlignmentEnum,
  BaselineAlignmentEnum
} from 'src/app/helpers/enums/cell-settings.enum';
import { GridRowHeader } from '../gridClasses/grid-row-header';
import { RowHeaderIconsService } from './row-header-icons.service';
import { MDraw } from 'src/app/helpers/draw-helper';
import { KlacksEmployee } from 'src/app/core/employee';

@Injectable({
  providedIn: 'root'
})
export class CreateRowHeaderService {
  private backgroundCollection: Map<string, HTMLCanvasElement> = new Map();
  private oldWidth = 0;

  private iconWidth = this.gridSetting.rowHeaderIconWith;
  private iconHeight = this.gridSetting.rowHeaderIconHeight;

  constructor(
    @Inject(GridSettingsService) private gridSetting: GridSettingsService,
    @Inject(GridDataService) private gridData: GridDataService,
    @Inject(RowHeaderIconsService) private rowIcons: RowHeaderIconsService
  ) { }

  reset() {
    this.iconWidth = Math.round(this.gridSetting.rowHeaderIconWith * this.gridSetting.zoom);
    this.iconHeight = Math.round(this.gridSetting.rowHeaderIconHeight * this.gridSetting.zoom);
    this.rowIcons.reset(this.gridSetting.headerBackGroundColor, this.iconWidth, this.iconHeight);

  }

  createHeader(ctx: CanvasRenderingContext2D, width: number): void {
    ctx.canvas.width = width;
    ctx.canvas.height =
      this.gridSetting.cellHeaderHeight;

    ctx.fillStyle = this.gridSetting.headerBackGroundColor;
    ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);

    this.drawBorder(ctx, 1);
    this.drawTitle(ctx, 'Name');
  }

  private drawTitle(ctx: CanvasRenderingContext2D, text: string): void {
    MDraw.drawText(
      ctx,
      text,
      0,
      0,
      ctx.canvas.width,
      this.gridSetting.cellHeaderHeight,
      this.gridSetting.font,
      12,
      this.gridSetting.headerForeGroundColor,
      TextAlignmentEnum.Center,
      BaselineAlignmentEnum.Center
    );
  }

  createRowHeader(row: number, width: number): GridRowHeader {

    if (this.oldWidth !== width) {
      this.backgroundCollection.clear();
    }

    const c = new GridRowHeader();

    if (this.gridData.employeeList.count() === 0) { return; }
    if (this.gridData.rowEmployeeIndex.length === 0) { return; }


    const index: number = this.gridData.rowEmployeeIndex[row];
    c.firstRow = this.gridData.indexEmployeeRow[index];

    const emp: KlacksEmployee = this.gridData.employeeList.item(index);
    if (emp === undefined) { return; }

    const neededRows: number = emp.neededRows;

    c.lastRow = c.firstRow + neededRows - 1;

    const tempCanvas = document.createElement('canvas');
    const ctx: CanvasRenderingContext2D = tempCanvas.getContext('2d');

    tempCanvas.width = width;
    tempCanvas.height = (
      this.gridSetting.cellHeight * neededRows +
      this.gridSetting.increaseBorder);

    this.drawBorder(ctx);

    MDraw.drawText(
      ctx,
      emp.fullName,
      0,
      0,
      tempCanvas.width,
      tempCanvas.height,
      this.gridSetting.font,
      12,
      this.gridSetting.foreGroundColor,
      TextAlignmentEnum.Left,
      BaselineAlignmentEnum.Center
    );

    this.drawIcon(ctx, tempCanvas.width);

    c.img = tempCanvas;

    return c;
  }

  private drawIcon(ctx: CanvasRenderingContext2D, width: number) {
    const rowIcons1 = this.rowIcons.malePicto;
    ctx.drawImage(rowIcons1, width - (this.iconWidth + 4), 2);

    const rowIcons2 = this.rowIcons.femalePicto;
    ctx.drawImage(rowIcons2, width - ((this.iconWidth * 2) + 4), 2);
    const rowIcons3 = this.rowIcons.paperClipPicto;
    ctx.drawImage(rowIcons3, width - ((this.iconWidth * 3) + 4), 2);
    const rowIcons4 = this.rowIcons.paperPlanePicto;
    ctx.drawImage(rowIcons4, width - ((this.iconWidth * 4) + 4), 2);
    const rowIcons5 = this.rowIcons.paperPlaneExpiredPicto;
    ctx.drawImage(rowIcons5, width - ((this.iconWidth * 5) + 4), 2);
    const rowIcons6 = this.rowIcons.palmtreePicto;
    ctx.drawImage(rowIcons6, width - ((this.iconWidth * 6) + 4), 2);
    const rowIcons7 = this.rowIcons.filterPicto;
    ctx.drawImage(rowIcons7, width - ((this.iconWidth * 7) + 4), 2);
    const rowIcons8 = this.rowIcons.gearPicto;
    ctx.drawImage(rowIcons8, width - ((this.iconWidth * 8) + 4), 2);
    const rowIcons9 = this.rowIcons.dogPicto;
    ctx.drawImage(rowIcons9, width - ((this.iconWidth * 9) + 4), 2);
    const rowIcons10 = this.rowIcons.batonPicto;
    ctx.drawImage(rowIcons10, width - ((this.iconWidth * 10) + 4), 2);
    const rowIcons11 = this.rowIcons.gunPicto;
    ctx.drawImage(rowIcons11, width - ((this.iconWidth * 11) + 4), 2);
    const rowIcons12 = this.rowIcons.govermentPicto;
    ctx.drawImage(rowIcons12, width - ((this.iconWidth * 11) + 4), 2);

  }

  private drawBorder(ctx: CanvasRenderingContext2D, deep: number = 2) {
    let img: HTMLCanvasElement;

    if (this.backgroundCollection.has(ctx.canvas.height.toString())) {
      img = this.backgroundCollection.get(ctx.canvas.height.toString());
    } else {
      const tempCanvas = document.createElement('canvas');
      const tmpCtx: CanvasRenderingContext2D = tempCanvas.getContext('2d');
      MDraw.createHiDPICanvas(tmpCtx);
      tempCanvas.width = ctx.canvas.width;
      tempCanvas.height = ctx.canvas.height;

      tmpCtx.fillStyle = this.gridSetting.headerBackGroundColor;
      tmpCtx.fillRect(0, 0, tempCanvas.width, tempCanvas.height);

      MDraw.drawBorder(
        tmpCtx,
        0,
        0,
        ctx.canvas.width,
        ctx.canvas.height,
        this.gridSetting.headerBackGroundColor,
        deep,
        Gradient3DBorderStyleEnum.Raised
      );

      this.backgroundCollection.set(ctx.canvas.height.toString(), tempCanvas);
      img = tempCanvas;
    }

    ctx.drawImage(img, 0, 0);
  }
}
