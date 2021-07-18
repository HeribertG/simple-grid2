import { CellTypeEnum, MenuIDEnum } from "../../helpers/enums/cell-settings.enum";
import { ContextMenu } from "./context-menu";
import { GridData } from "./data-grid";
import { Position } from "./position";

export class GridCellContextMenu {
  public contextMenus: Array<ContextMenu> = new Array<ContextMenu>();
  private gridData: GridData | undefined | null;
  constructor(gridData: GridData) {
    this.gridData = gridData;
  }
  createContextMenu(pos: Position): ContextMenu[] {
    const cell = this.gridData!.getItem(pos.row, pos.column);

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

  createFullStandardCellMenu(): void {
    this.clearMenu();
    this.contextMenus.push(new ContextMenu(MenuIDEnum.emCopy, 'Kopieren', true, 'STRG + C', false));
    this.contextMenus.push(new ContextMenu(MenuIDEnum.emCut, 'Ausschneiden', false, 'STRG + X', false));
    this.contextMenus.push(new ContextMenu(MenuIDEnum.emPaste, 'Einfügen', true, 'STRG + V', false,));
    this.contextMenus.push(new ContextMenu(MenuIDEnum.emPaste, '', true, '', true));
    this.contextMenus.push(new ContextMenu(MenuIDEnum.emShowAllEntries, 'alle Dienste', true, '', false,  this.createAllServicesMenu(this.contextMenus)));

  }

  createAllServicesMenu(parent : Array<ContextMenu>|undefined): ContextMenu[] {
    const tmpMenu: Array<ContextMenu> = new Array<ContextMenu>();

    tmpMenu.push(new ContextMenu(0, 'Versuch 1', true, '', true, undefined,parent ));
    return tmpMenu;
  }

  createEmptyCellMenu() { }

  clearMenu(): void {
    this.contextMenus = [];
  }

  destroy(): void {
    this.gridData = undefined;
  }
}
