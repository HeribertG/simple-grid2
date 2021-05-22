import { Color } from './color';
import { Gradient3DBorderStyleEnum } from './enums/draw.enum';
import { TextAlignmentEnum, BaselineAlignmentEnum } from './enums/cell-settings.enum';

export abstract class MDraw {

  public static GetDarkColor(color: string, d: number): string {
    let r: number | null | undefined = 0;
    let g: number | null | undefined = 0;
    let b: number | null | undefined = 0;

    const c: Color = new Color(color);

    if (c.r! > d) { r = c.r! - d; }
    if (c.g! > d) { g = c.g! - d; }
    if (c.b! > d) { b = c.b! - d; }

    return new Color(r, g, b).toHex();
  }

  public static GetLightColor(color: string, d: number): string {
    let r = 255;
    let g = 255;
    let b = 255;

    const c: Color = new Color(color);

    if (c.r! + d <= 255) { r = c.r! + d; }
    if (c.g! + d <= 255) { g = c.g! + d; }
    if (c.b! + d <= 255) { b = c.b! + d; }

    return new Color(r, g, b).toHex();
  }

  public static drawBorder(ctx: CanvasRenderingContext2D,
    x: number, y: number, w: number, h: number,
    backgroundColor: string, deep: number, borderStyle = Gradient3DBorderStyleEnum.Raised): void {

    if (deep > 1) {
      const darkColor: string = this.GetDarkColor(backgroundColor, 80);
      const lightColor: string = this.GetLightColor(backgroundColor, 250);
      this.drawGradient3DBorder(ctx, x, y, w, h, backgroundColor, darkColor, lightColor, deep, deep, borderStyle);
    }
  }

  public static drawGradient3DBorder(
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    w: number,
    h: number,
    currentBackColor: string,
    currentDarkColor: string,
    currentLightColor: string,
    currentDarkGradientNumber: number,
    currentLightGradientNumber: number,
    borderStyle: number
  ): void {

    let topLeft: string;
    let bottomRight: string;
    let topLeftWidth: number;
    let bottomRightWidth: number;

    if (borderStyle === Gradient3DBorderStyleEnum.Raised) {
      topLeft = currentLightColor;
      topLeftWidth = currentLightGradientNumber;
      bottomRight = currentDarkColor;
      bottomRightWidth = currentDarkGradientNumber;
    } else {
      topLeft = currentDarkColor;
      topLeftWidth = currentDarkGradientNumber;
      bottomRight = currentLightColor;
      bottomRightWidth = currentLightGradientNumber;
    }




    // TopLeftBorder
    const topLeftGradient: string[] = this.calculateColorGradient(currentBackColor, topLeft, topLeftWidth);

    for (let i = 0; i <= topLeftGradient.length - 1; i++) {
      ctx.beginPath();
      ctx.strokeStyle = topLeftGradient[topLeftGradient.length - 1 - i];
      ctx.lineWidth = 1;


      ctx.moveTo((w + x) - (i + 1), y + i); // right -top
      ctx.lineTo(x + i, y + i); // Left-Top
      ctx.lineTo(x + i, h - (i + 1));


      ctx.stroke();

    }

    // BottomRightBorder
    const bottomRightGradient: string[] = this.calculateColorGradient(currentBackColor, bottomRight, bottomRightWidth);

    for (let i = 0; i <= bottomRightGradient.length - 1; i++) {

      ctx.beginPath();
      ctx.strokeStyle = bottomRightGradient[bottomRightGradient.length - 1 - i];
      ctx.lineWidth = 1;

      ctx.moveTo(x + i, h - (i + 1)); // left-Bottom
      ctx.lineTo((w + x) - (i + 1), h - (i + 1)); // right-bottom
      ctx.lineTo((w + x) - (i + 1), y + i); // right-top

      ctx.stroke();
    }

    ctx.beginPath();
  }

  public static calculateColorGradient(startColor: string, endColor: string, numberOfGradients: number): string[] {

    const myColors: string[] = new Array(numberOfGradients - 1 + 1);

    let IncrementR: number;
    let IncrementG: number;
    let IncrementB: number;

    const endColorClass = new Color(endColor);
    const startColorClass = new Color(startColor);


    IncrementR = endColorClass.r! - startColorClass.r!;
    IncrementR = Math.ceil(IncrementR / numberOfGradients);

    IncrementG = endColorClass.g! - startColorClass.g!;
    IncrementG = Math.ceil(IncrementG / numberOfGradients);

    IncrementB = endColorClass.b! - startColorClass.b!;
    IncrementB = Math.ceil(IncrementB / numberOfGradients);


    for (let i = 0; i <= (myColors.length - 1); i++) {
      let r: number = startColorClass.r! + IncrementR * i;
      if (r > 255) {
        r = 255;
      }

      let g: number = startColorClass.g! + IncrementG * i;
      if (g > 255) {
        g = 255;
      }

      let b: number = startColorClass.b! + IncrementB * i;
      if (b > 255) {
        b = 255;
      }
      myColors[i] = new Color(r, g, b).toHex();
    }

    return myColors;
  }

  public static drawText(ctx: CanvasRenderingContext2D, text: string,
    x: number, y: number, w: number, h: number,
    font: string, fontSize: number, foregroundColor: string,
    textAlignment: TextAlignmentEnum, baselineAlignment: BaselineAlignmentEnum): void {

    ctx.save();
    ctx.rect(x + 3, y + 1, w - 5, h - 2);

    ctx.clip();

    ctx.font = font;

    let diffX = 3;
    let diffY = 1;
    const metrics: TextMetrics = ctx.measureText(text);

    switch (textAlignment) {

      case TextAlignmentEnum.Left: {
        break;
      }

      case TextAlignmentEnum.Center: {
        diffX = (w - metrics.width) / 2;
        break;
      }
      case TextAlignmentEnum.Right: {
        diffX = (w - metrics.width) - 2;
        break;
      }

      default: {
        diffX = (w - metrics.width) / 2;
        break;
      }
    }

    switch (baselineAlignment) {

      case BaselineAlignmentEnum.Top: {
        break;
      }

      case BaselineAlignmentEnum.Center: {
        diffY = (h - fontSize) / 2;
        break;
      }
      case BaselineAlignmentEnum.Bottom: {
        diffY = (h - fontSize) - 2;
        break;
      }

      default: {
        diffY = (h - fontSize) / 2;
        break;
      }
    }


    ctx.fillStyle = foregroundColor;
    ctx.textBaseline = 'top';

    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';

    ctx.fillText(text, x = Math.round(diffX + x), x = Math.round(diffY + y));

    ctx.restore();
  }

  public static createHiDPICanvas(ctx: CanvasRenderingContext2D) {
    const ratio = this.pixelRatio(ctx);
    ctx.transform(ratio, 0, 0, ratio, 0, 0);
  }

  public static pixelRatio(ctx: CanvasRenderingContext2D ): number {

    const dpr = window.devicePixelRatio || 1;

    const bsr = 1 //ctx.webkitBackingStorePixelRatio ||
      // ctx.mozBackingStorePixelRatio ||
      // ctx.msBackingStorePixelRatio ||
      // ctx.oBackingStorePixelRatio ||
      // ctx.backingStorePixelRatio || 1;

    return dpr / bsr;
  }

  public static createSVG(
    data: string,
    fillColor: string,
    strokeColor: string,
    backColor: string,
    width: number,
    height: number,
    StrokeThickness: number,
    viewSizeWidth: number,
    viewSizeHeight: number
  ): HTMLCanvasElement {

    const tempCanvas = document.createElement('canvas') as HTMLCanvasElement;

    const ctx = tempCanvas.getContext('2d') as CanvasRenderingContext2D;
    this.setAntiAliasing(ctx);
    tempCanvas.height = viewSizeHeight;
    tempCanvas.width = viewSizeWidth;

    ctx.fillStyle = backColor;
    ctx.fillRect(0, 0, viewSizeWidth, viewSizeHeight);

    const p = new Path2D(data);

    ctx.fillStyle = fillColor;
    ctx.fill(p);

    ctx.lineWidth = StrokeThickness;
    ctx.strokeStyle = strokeColor;
    ctx.stroke(p);

    const correctSizeCanvas = document.createElement('canvas') as HTMLCanvasElement;
    const ctx1 = correctSizeCanvas.getContext('2d') as CanvasRenderingContext2D;
    this.setAntiAliasing(ctx1);
    correctSizeCanvas.height = height;
    correctSizeCanvas.width = width;

    ctx1.drawImage(tempCanvas, 0, 0, tempCanvas.width, tempCanvas.height, 0, 0, width, height);

    return correctSizeCanvas;
  }

  public static setAntiAliasing(context : CanvasRenderingContext2D) {
    // context.imageSmoothingEnabled = false;       /* standard */
    // context.mozImageSmoothingEnabled = false;    /* Firefox */
    // context.oImageSmoothingEnabled = false;      /* Opera */
    // context.webkitImageSmoothingEnabled = false; /* Safari */
    // context.msImageSmoothingEnabled = false;     /* IE */
  }
}

