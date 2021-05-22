import { Injectable, Inject } from '@angular/core';
import { GridSettingsService } from './grid-settings.service';
import {
  KlacksPosition,
  KlacksPositionCollection
} from '../gridClasses/position';
import { ClipboardModeEnum } from '../../helpers/enums/grid-settings.enum';

@Injectable({
  providedIn: 'root'
})
export class GridCellManipulationService {
  public PositionCollection: KlacksPositionCollection = new KlacksPositionCollection();
  public Position: KlacksPosition|null|undefined;

  constructor(
    @Inject(GridSettingsService) private gridSetting: GridSettingsService
  ) {}

  isPositionInSelection(pos: KlacksPosition): boolean {
    if (this.Position!.isEqual(pos)) {
      return true;
    }

    if (this.PositionCollection.count() > 0) {
      for (let i = 0; i < this.PositionCollection.count(); i++) {
        if (this.PositionCollection.item(i).isEqual(pos)) {
          return true;
        }
      }
    }

    return false;
  }

  /* #region Clipboard */

  copy() {
    const copyEnabled: boolean =
      this.gridSetting.clipboardMode === ClipboardModeEnum.All ||
      this.gridSetting.clipboardMode === ClipboardModeEnum.Copy;

    if (!copyEnabled) {
      return;
    }

    if (this.PositionCollection.count() <= 1) {
      if (!this.Position!.isEmpty()) {
       const data: string =''; // = this.gridData.getItemMainText(
        //   this.Position.row,
        //   this.Position.column
        // );
        this.setClipboardData(data);
      }
    } else {
      const minCol: number = this.PositionCollection.minColumn();
      const maxCol: number = this.PositionCollection.maxColumn();
      const minRow: number = this.PositionCollection.minRow();
      const maxRow: number = this.PositionCollection.maxRow();
      const data: string = this.dataToStringArray(
        minRow,
        minCol,
        maxRow,
        maxCol
      );
      this.setClipboardData(data);
    }
  }

  paste() {}

  cut() {}

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
        if (this.PositionCollection.contains(new KlacksPosition(row, col))) {
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
