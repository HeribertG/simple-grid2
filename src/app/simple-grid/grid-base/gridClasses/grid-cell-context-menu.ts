import { CellTypeEnum, MenuIDEnum } from "../../helpers/enums/cell-settings.enum";
import { ContextMenu } from "./context-menu";
import { GridData } from "./data-grid";
import { Position } from "./position";

export class GridCellContextMenu {
    public contextMenus: Array<ContextMenu> = new Array<ContextMenu>();
    private gridData: GridData| undefined | null;
    constructor(gridData: GridData ) {
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
  
    createFullStandardCellMenu():void {
      this.clearMenu();
  
      this.contextMenus.push(new ContextMenu(MenuIDEnum.emCopy, 'Kopieren', true));
      this.contextMenus.push(new ContextMenu(MenuIDEnum.emCut, 'Ausschneiden', false));
      this.contextMenus.push(new ContextMenu(MenuIDEnum.emPaste, 'Einfügen', true));
    }
  
    createEmptyCellMenu() {}
  
    clearMenu():void  {
      this.contextMenus = [];
    }

    destroy():void {
        this.gridData= undefined;
    }
  }
  