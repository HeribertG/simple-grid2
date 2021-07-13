import { MDraw } from "../../helpers/draw-helper";
import { BaselineAlignmentEnum, TextAlignmentEnum } from "../../helpers/enums/cell-settings.enum";
import { Gradient3DBorderStyleEnum } from "../../helpers/enums/draw.enum";
import { GridData } from "./data-grid";
import { GridSetting } from "./grid-setting";

export class CreateHeader {

    private emptyHeader: ImageData |null|undefined;
    private gridSetting: GridSetting | undefined | null;
    private gridData: GridData | undefined | null;

    constructor(gridSetting: GridSetting, gridData: GridData) {
        this.gridSetting = gridSetting;
        this.gridData = gridData;
    }

    destroy(): void {
        this.gridSetting =null;
    }

  
    private init() {
  
      const tempCanvas = document.createElement('canvas');
      const ctx: CanvasRenderingContext2D |null|undefined = tempCanvas.getContext('2d');
      tempCanvas.width = this.gridSetting!.cellWidthWithHtmlZoom;
      tempCanvas.height = this.gridSetting!.cellHeaderHeightWithHtmlZoom;
  
      ctx!.fillStyle = this.gridSetting!.controlBackGroundColor;
      ctx!.fillRect(0, 0, tempCanvas.width, tempCanvas.height);
      // tslint:disable-next-line:max-line-length
      
  
      this.emptyHeader = ctx!.getImageData(0, 0,  tempCanvas.width, tempCanvas.height );
    }
  
    reset() {
      this.emptyHeader = undefined;
    }
  
    createHeader(col: number): HTMLCanvasElement {
  
      if (this.emptyHeader === undefined) {
        this.init();
      }
  
      const tempCanvas: HTMLCanvasElement = document.createElement('canvas') as HTMLCanvasElement;
      const ctx = tempCanvas.getContext('2d');
  
      tempCanvas.width = this.gridSetting!.cellWidthWithHtmlZoom;
      tempCanvas.height = this.gridSetting!.cellHeaderHeightWithHtmlZoom;
  
      ctx!.putImageData(this.emptyHeader!, 0, 0);
  
      const headerCell = this.gridData?.getHeaderItem(col);
      this.drawText(ctx!,  headerCell!.titel);

      MDraw.drawBorder(ctx!, 0, 0, tempCanvas.width , tempCanvas.height , this.gridSetting!.controlBackGroundColor, 2, Gradient3DBorderStyleEnum.Raised);
  
      return  tempCanvas;
  
  
    }
  
      
    private drawText(ctx: CanvasRenderingContext2D, text: string) {
  
      MDraw.drawText(ctx,
        text,
        0,
        0,
        this.gridSetting!.cellWidthWithHtmlZoom,
        this.gridSetting!.cellHeaderHeightWithHtmlZoom,
        this.gridSetting!.fontWithHtmlZoom,
        this.gridSetting!.mainFontSizeHtmlZoom,
        this.gridSetting!.headerForeGroundColor,
        TextAlignmentEnum.Center,
        BaselineAlignmentEnum.Center);
  
    }
  
    
  }