import { Injectable, Inject, } from '@angular/core';
import { GridSettingsService } from './grid-settings.service';
import { GridDataService } from './grid-data.service';
import { MDraw } from '../../helpers/draw-helper';
import { Gradient3DBorderStyleEnum } from '../../helpers/enums/draw.enum';
import { BaselineAlignmentEnum, TextAlignmentEnum } from '../../helpers/enums/cell-settings.enum';




@Injectable({
  providedIn: 'root'
})

export class CreateHeaderService {

  private dayNames: string[] = new Array('Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday');
  private emptyHeader: ImageData |null|undefined;

  constructor(@Inject(GridSettingsService) private gridSetting: GridSettingsService,
              @Inject(GridDataService) private gridData: GridDataService) { }

  private init() {

    const tempCanvas = document.createElement('canvas');
    const ctx: CanvasRenderingContext2D |null|undefined = tempCanvas.getContext('2d');
    tempCanvas.width = this.gridSetting.cellWidth;
    tempCanvas.height = this.gridSetting.cellHeaderHeight ;

    ctx!.fillStyle = this.gridSetting.headerBackGroundColor;
    ctx!.fillRect(0, 0, tempCanvas.width, tempCanvas.height);
    // tslint:disable-next-line:max-line-length
    MDraw.drawBorder(ctx!, 0, 0, tempCanvas.width , tempCanvas.height , this.gridSetting.headerBackGroundColor, 1, Gradient3DBorderStyleEnum.Raised);

    this.emptyHeader = ctx!.getImageData(0, 0,  tempCanvas.width, tempCanvas.height );
  }

  reset() {
    this.emptyHeader = undefined;
  }

  createHeader(col: number) {

    if (this.emptyHeader === undefined) {
      this.init();
    }

    const tempCanvas: HTMLCanvasElement = document.createElement('canvas') as HTMLCanvasElement;
    const ctx = tempCanvas.getContext('2d');

    tempCanvas.width = this.gridSetting.cellWidth;
    tempCanvas.height = this.gridSetting.cellHeaderHeight;

    ctx!.putImageData(this.emptyHeader!, 0, 0);

    this.drawText(ctx!, this.getTitle(col));

    return  ctx!.getImageData(0, 0, tempCanvas.width, tempCanvas.height);


  }

  getTitle(column: number): string {

   return '';
  }

  private drawText(ctx: CanvasRenderingContext2D, text: string) {

    MDraw.drawText(ctx,
      text,
      0,
      0,
      this.gridSetting.cellWidth,
      this.gridSetting.cellHeaderHeight,
      this.gridSetting.font,
      12,
      this.gridSetting.headerForeGroundColor,
      TextAlignmentEnum.Center,
      BaselineAlignmentEnum.Center);

  }

  private formatDate(date: Date) {

    const day = date.getDate();
    return  this.gridSetting.weekday[date.getDay()] + ' ' +  day + '. ' + this.gridSetting.monthsName[date.getMonth()] + '.';
  }
}
