import { MDraw } from "../../helpers/draw-helper";
import { BaselineAlignmentEnum, CellTypeEnum, TextAlignmentEnum } from "../../helpers/enums/cell-settings.enum";
import { Gradient3DBorderStyleEnum } from "../../helpers/enums/draw.enum";
import { GridData } from "./data-grid";
import { GridSetting } from "./grid-setting";

export class CreateCell {

    private lastLine = 5;
    private gridSetting: GridSetting | undefined | null;
    private gridData: GridData | undefined | null;

    constructor(gridSetting: GridSetting, gridData: GridData) {
        this.gridSetting = gridSetting;
        this.gridData = gridData;
    }

    destroy(): void {
        this.gridSetting = null;
        this.gridData = null;
    }


    private createEmptyCanvas(
        backGroundColor: string,
        width: number,
        height: number,
        isLast: boolean = false
    ): HTMLCanvasElement {
        const tempCanvas: HTMLCanvasElement = document.createElement('canvas');
        const ctx: CanvasRenderingContext2D | null = tempCanvas.getContext('2d');
        tempCanvas.width = width;
        tempCanvas.height = height;
        this.gridSetting!.lastPixelRatio = MDraw.pixelRatio();
        MDraw.setAntiAliasing(ctx!);
        MDraw.createHiDPICanvas(ctx!);

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
            ctx.strokeStyle = this.gridSetting!.borderColor;
            ctx.moveTo(0, height);
            ctx.lineTo(width, height);

            ctx.stroke();
        }

        ctx.restore();
    }

    createCell(row: number, col: number): HTMLCanvasElement {
        const tempCanvas: HTMLCanvasElement = this.createEmptyCanvas(
            this.gridSetting!.backGroundColor,
            this.gridSetting!.cellWidthWithHtmlZoom + this.gridSetting!.increaseBorder,
            this.gridSetting!.cellHeightWithHtmlZoom + this.gridSetting!.increaseBorder,
            false);

        const ctx = tempCanvas.getContext('2d');

        const gridCell = this.gridData!.getItem(row, col);


        const text = row.toString() + ' / ' + col.toString();
        this.drawMainText(ctx!, text)
        MDraw.drawBorder(ctx!, 0, 0, tempCanvas.width, tempCanvas.height, '#FF5733', 3, Gradient3DBorderStyleEnum.Sunken)

        this.drawSimpleBorder(ctx!);

        return tempCanvas;

    }

    private drawBorder(ctx: CanvasRenderingContext2D): void {
        ctx.beginPath();
        ctx.strokeStyle = 'black';
        ctx.lineWidth = 1;

        // left top
        ctx.moveTo(0, 0);
        // right top
        ctx.lineTo(this.gridSetting!.cellWidth, 0);
        // right bottom
        ctx.lineTo(
            this.gridSetting!.cellWidth,
            this.gridSetting!.cellHeight + this.gridSetting!.increaseBorder
        );
        // left bottom
        ctx.lineTo(
            0,
            this.gridSetting!.cellHeight + this.gridSetting!.increaseBorder
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
            this.gridSetting!.cellWidthWithHtmlZoom,
            this.gridSetting!.mainTextHeightWithHtmlZoom,
            this.gridSetting!.subFontWithHtmlZoom,
            this.gridSetting!.subFontsizeithHtmlZoom,
            this.gridSetting!.mainFontColor,
            TextAlignmentEnum.Center,
            BaselineAlignmentEnum.Center
        );
    }

    private drawFirstSubText(ctx: CanvasRenderingContext2D, text: string) {
        MDraw.drawText(
            ctx,
            text,
            0,
            this.gridSetting!.mainTextHeight,
            this.gridSetting!.cellWidth,
            this.gridSetting!.firstSubTextHeight,
            this.gridSetting!.subFont,
            10,
            this.gridSetting!.subFontColor,
            TextAlignmentEnum.Center,
            BaselineAlignmentEnum.Center
        );
    }

    private drawSecondSubText(ctx: CanvasRenderingContext2D, text: string) {
        MDraw.drawText(
            ctx,
            text,
            0,
            this.gridSetting!.mainTextHeight + this.gridSetting!.firstSubTextHeight,
            this.gridSetting!.cellWidth,
            this.gridSetting!.secondSubTextHeight,
            this.gridSetting!.subFont,
            10,
            this.gridSetting!.subFontColor,
            TextAlignmentEnum.Left,
            BaselineAlignmentEnum.Center
        );
    }

    drawSimpleBorder(ctx: CanvasRenderingContext2D) {
        ctx.strokeStyle = this.gridSetting!.borderColor;
        ctx.lineWidth = 0.5;
        ctx.strokeRect(
            0,
            0,
            this.gridSetting!.cellWidth + this.gridSetting!.increaseBorder,
            this.gridSetting!.cellHeight + this.gridSetting!.increaseBorder
        );
    }
}