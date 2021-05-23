import { ClipboardModeEnum } from "../../helpers/enums/grid-settings.enum";
import { GridSetting } from "./grid-setting";
import { Position, PositionCollection } from "./position";

export class GridCellManipulation {
    public positionCollection: PositionCollection = new PositionCollection();
    public position: Position | null | undefined;
    gridSetting: GridSetting | undefined | null;

    constructor(gridSetting: GridSetting) {
        this.gridSetting = gridSetting;
    }

    destroy(): void {
        this.gridSetting =null;
    }
    
    isPositionInSelection(pos: Position): boolean {
        if (this.position!.isEqual(pos)) {
            return true;
        }

        if (this.positionCollection.count() > 0) {
            for (let i = 0; i < this.positionCollection.count(); i++) {
                if (this.positionCollection.item(i).isEqual(pos)) {
                    return true;
                }
            }
        }

        return false;
    }

    /* #region Clipboard */

    copy(): void  {
        const copyEnabled: boolean =
            this.gridSetting!.clipboardMode === ClipboardModeEnum.All ||
            this.gridSetting!.clipboardMode === ClipboardModeEnum.Copy;

        if (!copyEnabled) {
            return;
        }

        if (this.positionCollection.count() <= 1) {
            if (!this.position!.isEmpty()) {
                const data: string = ''; // = this.gridData.getItemMainText(
                //   this.Position.row,
                //   this.Position.column
                // );
                this.setClipboardData(data);
            }
        } else {
            const minCol: number = this.positionCollection.minColumn();
            const maxCol: number = this.positionCollection.maxColumn();
            const minRow: number = this.positionCollection.minRow();
            const maxRow: number = this.positionCollection.maxRow();
            const data: string = this.dataToStringArray(
                minRow,
                minCol,
                maxRow,
                maxCol
            );
            this.setClipboardData(data);
        }
    }

    paste() { }

    cut() { }

    private setClipboardData(data: string): void {
        let listener = (e: ClipboardEvent) => {
            const clipboard = e.clipboardData;
            clipboard!.setData('text', data.toString());
            e.preventDefault();
        };

        document.addEventListener('copy', listener, false);
        document.execCommand('copy');
        document.removeEventListener('copy', listener, false);

    }

    private dataToStringArray(
        minRow: number,
        minCol: number,
        maxRow: number,
        maxCol: number
    ): string {
        let dataString = '';

        for (let row = minRow; row <= maxRow; row++) {
            for (let col = minCol; col <= maxCol; col++) {
                if (this.positionCollection.contains(new Position(row, col))) {
                    //dataString += this.gridData.getItemMainText(row, col);
                    if (col < maxCol) {
                        dataString += '\t';
                    }
                } else {
                    if (col < maxCol) {
                        dataString += '\t';
                    }
                }
            }
            dataString += '\r\n';
        }
        return dataString;
    }

    /* #endregion Clipboard */
}
