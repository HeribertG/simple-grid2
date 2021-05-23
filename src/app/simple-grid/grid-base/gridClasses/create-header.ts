import { MDraw } from "../../helpers/draw-helper";
import { BaselineAlignmentEnum, TextAlignmentEnum } from "../../helpers/enums/cell-settings.enum";
import { Gradient3DBorderStyleEnum } from "../../helpers/enums/draw.enum";
import { GridSetting } from "./grid-setting";

export class CreateHeader {

    private emptyHeader: ImageData |null|undefined;
    private gridSetting: GridSetting | undefined | null;

    constructor(gridSetting: GridSetting) {
        this.gridSetting = gridSetting;
    }

    destroy(): void {
        this.gridSetting =null;
    }

  
    private init() {
  
      const tempCanvas = document.createElement('canvas');
      const ctx: CanvasRenderingContext2D |null|undefined = tempCanvas.getContext('2d');
      tempCanvas.width = this.gridSetting!.cellWidth;
      tempCanvas.height = this.gridSetting!.cellHeaderHeight ;
  
      ctx!.fillStyle = this.gridSetting!.headerBackGroundColor;
      ctx!.fillRect(0, 0, tempCanvas.width, tempCanvas.height);
      // tslint:disable-next-line:max-line-length
      MDraw.drawBorder(ctx!, 0, 0, tempCanvas.width , tempCanvas.height , this.gridSetting!.headerBackGroundColor, 1, Gradient3DBorderStyleEnum.Raised);
  
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
  
      tempCanvas.width = this.gridSetting!.cellWidth;
      tempCanvas.height = this.gridSetting!.cellHeaderHeight;
  
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
        this.gridSetting!.cellWidth,
        this.gridSetting!.cellHeaderHeight,
        this.gridSetting!.font,
        12,
        this.gridSetting!.headerForeGroundColor,
        TextAlignmentEnum.Center,
        BaselineAlignmentEnum.Center);
  
    }
  
    
  }