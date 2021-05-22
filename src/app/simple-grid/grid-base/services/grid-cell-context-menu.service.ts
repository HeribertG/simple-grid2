import { Injectable, Inject } from '@angular/core';
import { KlacksPosition } from '../gridClasses/position';

import { ContextMenu } from '../gridClasses/context-menu';
import { CellTypeEnum, MenuIDEnum } from '../../helpers/enums/cell-settings.enum';
import { GridDataService } from './grid-data.service';

@Injectable({
  providedIn: 'root'
})
export class GridCellContextMenuService {
  constructor(private gridData: GridDataService) {}
  public contextMenus: Array<ContextMenu> = new Array<ContextMenu>();

  createContextMenu(pos: KlacksPosition): ContextMenu[] {
    const cell = this.gridData.getItem(pos.row, pos.column);

    if (cell !== undefined) {
      switch (cell.cellType) {
        case CellTypeEnum.Empty: {
          break;
        }
        case CellTypeEnum.Standard: {
          this.createFullStandardCellMenu();
        }
      }
    }

    return this.contextMenus;
  }

  createFullStandardCellMenu() {
    this.clearMenu();

    this.contextMenus.push(new ContextMenu(MenuIDEnum.emCopy, 'Kopieren', true));
    this.contextMenus.push(new ContextMenu(MenuIDEnum.emCut, 'Ausschneiden', false));
    this.contextMenus.push(new ContextMenu(MenuIDEnum.emPaste, 'Einfügen', false));
  }

  createEmptyCellMenu() {}

  clearMenu() {
    this.contextMenus = [];
  }
}
