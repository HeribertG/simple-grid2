import { MDraw } from "../../helpers/draw-helper";
import { GridData } from "./data-grid";
import { GridCell, GridCellResult } from "./grid-cell";
import { IMergeCell } from "./merge-cell";

export class CreateCell {

  
    private gridData: GridData | undefined | null;

    constructor(gridData: GridData) {
        this.gridData = gridData;
    }

    destroy(): void {
        this.gridData?.destroy();
        this.gridData = null;
    }


    private createEmptyCanvas(
        backGroundColor: string,
        width: number,
        height: number,
        isLast: boolean = false
    ): HTMLCanvasElement {
        this.gridData!.gridSetting!.lastPixelRatio = MDraw.pixelRatio();
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
            ctx.strokeStyle = this.gridData!.gridSetting!.borderColor;
            ctx.moveTo(0, height);
            ctx.lineTo(width, height);

            ctx.stroke();
        }

        ctx.restore();
    }

    createCell(row: number, col: number): [canvas: HTMLCanvasElement, gridCellResult: GridCellResult | undefined] {
        const gridCell = this.gridData!.getItem(row, col);

        const gridCellResult = new GridCellResult();
        const mergeCell = this.gridData!.mergeCellCollection!.itemByColRow(row, col);

        this.setGridCellResult(row, col, gridCellResult, mergeCell);


        const cellCanvas = this.createCanvas(gridCell, mergeCell);
        const ctx = cellCanvas.getContext('2d');

        if (!gridCell.isEmpty()) {

            this.drawMainText(ctx!, gridCell, mergeCell);
            if (gridCell.hasSubText()) {
                if (gridCell.firstSubText) {
                    this.drawFirstSubText(ctx!, gridCell, mergeCell);
                }
                if (gridCell.secondSubText) {
                    this.drawSecondSubText(ctx!, gridCell, mergeCell);
                }
            }

        }


        return [cellCanvas, gridCellResult];

    }

    private setGridCellResult(row: number, col: number, gridCellResult: GridCellResult, mergeCell: IMergeCell | undefined): void {
        gridCellResult.originalRow = row;
        gridCellResult.originalCol = col;
        gridCellResult.rowSpan = 1;
        gridCellResult.colSpan = 1;

        if (mergeCell) {
            gridCellResult.originalRow = mergeCell.position.row;
            gridCellResult.originalCol = mergeCell.position.column;
            gridCellResult.rowSpan = mergeCell.rowSpan;
            gridCellResult.colSpan = mergeCell.colSpan;
        }
    }

    private createCanvas(gridCell: GridCell, mergeCell: IMergeCell | undefined): HTMLCanvasElement {


        let colSpan = 1;
        let rowSpan = 1;

        if (mergeCell) {
            colSpan = mergeCell.colSpan;
            rowSpan = mergeCell.rowSpan;
        }


        let backGroundColor = this.gridData!.gridSetting!.backGroundColor;

        if (gridCell.backgroundColor) { backGroundColor = gridCell.backgroundColor; }

        return this.createEmptyCanvas(
            backGroundColor,
            (this.gridData!.gridSetting!.cellWidthWithHtmlZoom * colSpan) + this.gridData!.gridSetting!.increaseBorder,
            (this.gridData!.gridSetting!.cellHeightWithHtmlZoom * rowSpan) + this.gridData!.gridSetting!.increaseBorder,
            false);
    }

    private drawBorder(ctx: CanvasRenderingContext2D): void {
        ctx.beginPath();
        ctx.strokeStyle = 'black';
        ctx.lineWidth = this.gridData!.gridSetting!.increaseBorderHtmlZoom;

        // left top
        ctx.moveTo(0, 0);
        // right top
        ctx.lineTo(this.gridData!.gridSetting!.cellWidthWithHtmlZoom, 0);
        // right bottom
        ctx.lineTo(
            this.gridData!.gridSetting!.cellWidthWithHtmlZoom,
            this.gridData!.gridSetting!.cellHeightWithHtmlZoom + this.gridData!.gridSetting!.increaseBorderHtmlZoom
        );
        // left bottom
        ctx.lineTo(
            0,
            this.gridData!.gridSetting!.cellHeightWithHtmlZoom + this.gridData!.gridSetting!.increaseBorderHtmlZoom
        );
        ctx.lineTo(0, 0);
        ctx.stroke();
    }

    private drawMainText(ctx: CanvasRenderingContext2D, gridCell: GridCell, mergeCell: IMergeCell | undefined) {
        let colSpan = 1;
        let rowSpan = 1;

        if (mergeCell) {
            colSpan = mergeCell.colSpan;
            rowSpan = mergeCell.rowSpan;
        }

        MDraw.drawText(
            ctx,
            gridCell.mainText,
            this.gridData!.gridSetting!.cellPadding,
            this.gridData!.gridSetting!.cellPadding,
            (this.gridData!.gridSetting!.cellWidthWithHtmlZoom * colSpan) - (this.gridData!.gridSetting!.cellPadding * 2),
            (this.gridData!.gridSetting!.mainTextHeightWithHtmlZoom * rowSpan),
            this.gridData!.gridSetting!.fontWithHtmlZoom,
            this.gridData!.gridSetting!.mainFontSizeHtmlZoom,
            this.gridData!.gridSetting!.mainFontColor,
            gridCell.mainTextAlignment,
            gridCell.mainTextBaselineAlignment
        );
    }

    private drawFirstSubText(ctx: CanvasRenderingContext2D, gridCell: GridCell, mergeCell: IMergeCell | undefined) {
        let colSpan = 1;
        let rowSpan = 1;

        if (mergeCell) {
            colSpan = mergeCell.colSpan;
            rowSpan = mergeCell.rowSpan;
        }


        MDraw.drawText(
            ctx,
            gridCell.firstSubText,
            this.gridData!.gridSetting!.cellPadding,
            this.gridData!.gridSetting!.mainTextHeightWithHtmlZoom,
            (this.gridData!.gridSetting!.cellWidthWithHtmlZoom * colSpan) - (this.gridData!.gridSetting!.cellPadding * 2),
            this.gridData!.gridSetting!.firstSubTextHeightWithHtmlZoom,
            this.gridData!.gridSetting!.subFontWithHtmlZoom,
            this.gridData!.gridSetting!.firstSubFontSizeHtmlZoom,
            this.gridData!.gridSetting!.subFontColor,
            gridCell.firstSubTextAlignment,
            gridCell.firstSubTextBaselineAlignment
        );
    }

    private drawSecondSubText(ctx: CanvasRenderingContext2D, gridCell: GridCell, mergeCell: IMergeCell | undefined) {

        let colSpan = 1;
        let rowSpan = 1;

        if (mergeCell) {
            colSpan = mergeCell.colSpan;
            rowSpan = mergeCell.rowSpan;
        }

        MDraw.drawText(
            ctx,
            gridCell.secondSubText,
            this.gridData!.gridSetting!.cellPadding,
            this.gridData!.gridSetting!.mainTextHeightWithHtmlZoom + this.gridData!.gridSetting!.firstSubTextHeightWithHtmlZoom,
            (this.gridData!.gridSetting!.cellWidthWithHtmlZoom * colSpan)- (this.gridData!.gridSetting!.cellPadding * 2),
            this.gridData!.gridSetting!.secondSubTextHeightWithHtmlZoom,
            this.gridData!.gridSetting!.subFontWithHtmlZoom,
            this.gridData!.gridSetting!.secondSubFontSizeHtmlZoom,
            this.gridData!.gridSetting!.subFontColor,
            gridCell.secondSubTextAlignment,
            gridCell.secondSubTextBaselineAlignment
        );
    }

    drawSimpleBorder(ctx: CanvasRenderingContext2D) {



        ctx.strokeStyle = this.gridData!.gridSetting!.borderColor;
        ctx.lineWidth = this.gridData!.gridSetting!.increaseBorderHtmlZoom;
        ctx.strokeRect(
            0,
            0,
            ctx.canvas.width + this.gridData!.gridSetting!.increaseBorderHtmlZoom,
            ctx.canvas.height + this.gridData!.gridSetting!.increaseBorderHtmlZoom,
        );
    }
}