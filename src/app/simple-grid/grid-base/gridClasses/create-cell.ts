import { MDraw } from "../../helpers/draw-helper";
import { BaselineAlignmentEnum, TextAlignmentEnum } from "../../helpers/enums/cell-settings.enum";
import { Gradient3DBorderStyleEnum } from "../../helpers/enums/draw.enum";
import { GridData } from "./data-grid";
import { GridCell, GridCellResult } from "./grid-cell";
import { GridSetting } from "./grid-setting";

export class CreateCell {

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
        this.gridSetting!.lastPixelRatio = MDraw.pixelRatio();
        const tempCanvas: HTMLCanvasElement = document.createElement('canvas');
        const ctx: CanvasRenderingContext2D | null = tempCanvas.getContext('2d');
        ctx!.imageSmoothingQuality = 'high';
        MDraw.setAntiAliasing(ctx!);
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
            ctx.strokeStyle = this.gridSetting!.borderColor;
            ctx.moveTo(0, height);
            ctx.lineTo(width, height);

            ctx.stroke();
        }

        ctx.restore();
    }

    createCell(row: number, col: number): [canvas:HTMLCanvasElement,gridCellResult:GridCellResult|undefined] {
        const gridCell = this.gridData!.getItem(row, col);
        const gridCellResult = new GridCellResult();
       
       const cellCanvas =  this.createCanvas(gridCell);
        const ctx = cellCanvas.getContext('2d');

        if (!gridCell.isEmpty()) {

            this.drawMainText(ctx!, gridCell);
            if (gridCell.hasSubText()) {
                if (gridCell.firstSubText) {
                    this.drawFirstSubText(ctx!, gridCell);
                }
                if (gridCell.secondSubText) {
                    this.drawSecondSubText(ctx!, gridCell);
                }
            }

        }

        //  MDraw.drawBorder(ctx!, 0, 0,  this.gridSetting!.cellWidthWithHtmlZoom, tempCanvas.height, '#FF5733', 3, Gradient3DBorderStyleEnum.Sunken)

        // this.drawBorder(ctx!);
        this.drawSimpleBorder(ctx!);
        

        return [cellCanvas, gridCellResult];

    }

    private createCanvas(gridCell: GridCell): HTMLCanvasElement {

        let colSpan = gridCell.colspan;
        let rowSpan = gridCell.rowSpan;

        if (colSpan <= 1) { colSpan = 1; }
        if (rowSpan <= 1) { rowSpan = 1; }

        let backGroundColor = this.gridSetting!.backGroundColor;

        if (gridCell.backgroundColor){backGroundColor = gridCell.backgroundColor;}

            return this.createEmptyCanvas(
                backGroundColor,
                (this.gridSetting!.cellWidthWithHtmlZoom * colSpan) + this.gridSetting!.increaseBorder,
                (this.gridSetting!.cellHeightWithHtmlZoom * rowSpan) + this.gridSetting!.increaseBorder,
                false);
    }

    private drawBorder(ctx: CanvasRenderingContext2D): void {
        ctx.beginPath();
        ctx.strokeStyle = 'black';
        ctx.lineWidth = this.gridSetting!.increaseBorderHtmlZoom;

        // left top
        ctx.moveTo(0, 0);
        // right top
        ctx.lineTo(this.gridSetting!.cellWidthWithHtmlZoom, 0);
        // right bottom
        ctx.lineTo(
            this.gridSetting!.cellWidthWithHtmlZoom,
            this.gridSetting!.cellHeightWithHtmlZoom + this.gridSetting!.increaseBorderHtmlZoom
        );
        // left bottom
        ctx.lineTo(
            0,
            this.gridSetting!.cellHeightWithHtmlZoom + this.gridSetting!.increaseBorderHtmlZoom
        );
        ctx.lineTo(0, 0);
        ctx.stroke();
    }

    private drawMainText(ctx: CanvasRenderingContext2D, gridCell: GridCell) {
        let colSpan = gridCell.colspan;
        let rowSpan = gridCell.rowSpan;

        if (colSpan <= 1) { colSpan = 1 }
        if (rowSpan <= 1) { rowSpan = 1 }

        MDraw.drawText(
            ctx,
            gridCell.mainText,
            0,
            0,
            (this.gridSetting!.cellWidthWithHtmlZoom * colSpan),
            (this.gridSetting!.mainTextHeightWithHtmlZoom * rowSpan),
            this.gridSetting!.fontWithHtmlZoom,
            this.gridSetting!.mainFontSizeHtmlZoom,
            this.gridSetting!.mainFontColor,
            TextAlignmentEnum.Center,
            BaselineAlignmentEnum.Center
        );
    }

    private drawFirstSubText(ctx: CanvasRenderingContext2D, gridCell: GridCell) {

        let colSpan = gridCell.colspan;
        let rowSpan = gridCell.rowSpan;

        if (colSpan <= 1) { colSpan = 1 }
        if (rowSpan <= 1) { rowSpan = 1 }

        MDraw.drawText(
            ctx,
            gridCell.firstSubText,
            0,
            this.gridSetting!.mainTextHeightWithHtmlZoom,
            (this.gridSetting!.cellWidthWithHtmlZoom * colSpan),
            this.gridSetting!.firstSubTextHeightWithHtmlZoom,
            this.gridSetting!.subFontWithHtmlZoom,
            this.gridSetting!.firstSubFontSizeHtmlZoom,
            this.gridSetting!.subFontColor,
            TextAlignmentEnum.Center,
            BaselineAlignmentEnum.Center
        );
    }

    private drawSecondSubText(ctx: CanvasRenderingContext2D, gridCell: GridCell) {

        let colSpan = gridCell.colspan;
        let rowSpan = gridCell.rowSpan;

        if (colSpan <= 1) { colSpan = 1 }
        if (rowSpan <= 1) { rowSpan = 1 }

        MDraw.drawText(
            ctx,
            gridCell.secondSubText,
            0,
            this.gridSetting!.mainTextHeightWithHtmlZoom + this.gridSetting!.firstSubTextHeightWithHtmlZoom,
            (this.gridSetting!.cellWidthWithHtmlZoom * colSpan),
            this.gridSetting!.secondSubTextHeightWithHtmlZoom,
            this.gridSetting!.subFontWithHtmlZoom,
            this.gridSetting!.secondSubFontSizeHtmlZoom,
            this.gridSetting!.subFontColor,
            TextAlignmentEnum.Left,
            BaselineAlignmentEnum.Center
        );
    }

    drawSimpleBorder(ctx: CanvasRenderingContext2D) {
        ctx.strokeStyle = this.gridSetting!.borderColor;
        ctx.lineWidth = this.gridSetting!.increaseBorderHtmlZoom;
        ctx.strokeRect(
            0,
            0,
            this.gridSetting!.cellWidthWithHtmlZoom + this.gridSetting!.increaseBorderHtmlZoom,
            this.gridSetting!.cellHeightWithHtmlZoom + this.gridSetting!.increaseBorderHtmlZoom
        );
    }
}