
import { Component, EventEmitter, Input, NgZone, OnDestroy, OnInit, Output, Renderer2 } from '@angular/core';
import { GridBodyComponent } from '../grid-base/grid-body/grid-body.component';
import { Position } from '../grid-base/gridClasses/position';
import { MenuIDEnum } from '../helpers/enums/cell-settings.enum';
import { Rectangle } from '../helpers/geometry';
import { ContextMenu } from './menuClasses/context-menu';
import { GridCellContextMenu } from './menuClasses/grid-cell-context-menu';

@Component({
  selector: 'app-simple-context-menu',
  templateUrl: './simple-context-menu.component.html',
  styleUrls: ['./simple-context-menu.component.scss']
})
export class SimpleContextMenuComponent implements OnInit, OnDestroy {

  @Input() gridBody: GridBodyComponent | undefined | null;
  @Input() gridCellContextMenu: GridCellContextMenu | undefined | null;
  @Output() contextMenuActionEvent = new EventEmitter<ContextMenu>();

  private contextMenu: HTMLDivElement | undefined | null;
  private contextMenu1: HTMLDivElement | undefined | null;
  private contextMenu2: HTMLDivElement | undefined | null;
  private contextMenu3: HTMLDivElement | undefined | null;
  private contextMenu4: HTMLDivElement | undefined | null;
  private contextMenu5: HTMLDivElement | undefined | null;
  private isContextMenu = false;
  private contextMenuPosition = new Map<number, { x: number, y: number, rect: any, offsetTop: number }>();
  private contextMenus = new Map<number, ContextMenu[] | undefined | null>();
  private isOpenIndex = -1;

  constructor(
    private renderer: Renderer2,
  ) { }

  ngOnInit(): void {

    this.contextMenu = document.getElementById('contextMenu') as HTMLDivElement;
    this.contextMenu1 = document.getElementById('contextMenu1') as HTMLDivElement;
    this.contextMenu2 = document.getElementById('contextMenu2') as HTMLDivElement;
    this.contextMenu3 = document.getElementById('contextMenu3') as HTMLDivElement;
    this.contextMenu4 = document.getElementById('contextMenu4') as HTMLDivElement;
    this.contextMenu5 = document.getElementById('contextMenu5') as HTMLDivElement;
  }

  ngOnDestroy(): void {
    this.contextMenu = undefined;
    this.contextMenu1 = undefined;
    this.contextMenu2 = undefined;
    this.contextMenu3 = undefined;
    this.contextMenu4 = undefined;
    this.contextMenu5 = undefined;
  }

  showMenu(index: number): void {

    const tmp = this.currentMenuHTMLDivElement(index);

    const tmpX = this.contextMenuPosition.get(index)!.x;
    const tmpY = this.contextMenuPosition.get(index)!.y;

    this.renderer.setStyle(tmp, 'top', tmpY + 'px');
    this.renderer.setStyle(tmp, 'left', tmpX + 'px');
    this.renderer.setStyle(tmp, 'display', 'block');
    this.renderer.setStyle(tmp, ' visibility', 'visible');
    setTimeout(() => {
      if (index === 0) {
        this.replaceMenu();
      } else {
        this.replaceSubMenu(index);
      }

    }, 20);

  }

  private replaceMenu(): void {
    let mustMove = false;
    const menuBottom = this.contextMenu!.offsetTop + this.contextMenu!.clientHeight;
    const menuRight = this.contextMenu!.offsetLeft + this.contextMenu!.clientWidth;
    const diffY = this.gridBody!.clientHeight - menuBottom;
    const diffX = this.gridBody!.clientWidth - menuRight;

    const pos = this.contextMenuPosition.get(0)!;
    if (diffY < 0) {
      mustMove = true;
      pos.y = this.contextMenu!.offsetTop - this.contextMenu!.clientHeight;
    }
    if (diffX < 0) {
      mustMove = true;
      pos.x = this.contextMenu!.offsetLeft - this.contextMenu!.clientWidth;
    }

    pos.rect = new Rectangle(0, 0, this.contextMenu!.clientWidth, this.contextMenu!.clientHeight);

    this.contextMenuPosition.delete(0);
    this.contextMenuPosition.set(0, pos);

    if (mustMove) {


      this.renderer.setStyle(this.contextMenu!, 'top', pos.y + 'px');
      this.renderer.setStyle(this.contextMenu!, 'left', pos.x + 'px');
    }


  }

  private replaceSubMenu(index: number): void {
    let mustMove = false;
    const tmp = this.currentMenuHTMLDivElement(index);
    const parentTmp = this.currentMenuHTMLDivElement(index - 1);

    const menuBottom = tmp!.offsetTop + tmp!.clientHeight;
    const menuRight = tmp!.offsetLeft + tmp!.clientWidth;
    const diffY = this.gridBody!.clientHeight - menuBottom;
    const diffX = this.gridBody!.clientWidth - menuRight;

    const pos = this.contextMenuPosition.get(index)!;
    const parentPos = this.contextMenuPosition.get(index - 1)!;

    if (diffY < 0) {
      mustMove = true;
      pos.y = parentPos!.offsetTop - tmp!.clientHeight;
    }
    if (diffX < 0) {
      mustMove = true;
      pos.x = tmp!.offsetLeft - tmp!.clientWidth -6;
    }

    pos.rect = new Rectangle(0, 0, tmp!.clientWidth, tmp!.clientHeight);

    this.contextMenuPosition.delete(index);
    this.contextMenuPosition.set(index, pos);

    if (mustMove) {


      this.renderer.setStyle(tmp!, 'top', pos.y + 'px');
      this.renderer.setStyle(tmp!, 'left', pos.x + 'px');
    }


  }

  menus(index: number): ContextMenu[] {
    const m = this.contextMenus.get(index);

    if (m) {
      return m
    } else {
      return new Array<ContextMenu>();
    }
  }

  showContextMenu(event: MouseEvent): void {
    this.clearMenus();

    const pos: Position = this.gridBody!.calcCorrectCoordinate(event);

    if (!this.gridBody!.cellManipulation!.isPositionInSelection(pos)) {
      this.gridBody!.destroySelection();
      this.gridBody!.position = pos;
    }

    const subMenus = this.gridCellContextMenu!.createContextMenu(pos);
    if (subMenus.length > 0) {

      this.contextMenus.delete(0);
      this.contextMenus.set(0, subMenus);

      const pos = { x: 0, y: 0, rect: new Rectangle(0, 0, 0, 0), offsetTop: -1 };
      pos.x = event.clientX;
      pos.y = event.clientY;

      this.contextMenuPosition.set(0, pos);

      this.showMenu(0);

      setTimeout(() => {
        this.isContextMenu = true;
      }, 200);
    }

  }

  onContextMenuEnter(value: ContextMenu, index: number, event: any): void {

    if (value.hasChildren) {
      const top = event.currentTarget.offsetTop;
      const pos = this.contextMenuPosition.get(index);
      pos!.offsetTop = top;

      this.contextMenus.delete(index + 1);
      this.contextMenus.set(index + 1, value.children!);

      this.contextMenuPosition.delete(index + 1)
      const pos1 = { x: 0, y: 0, rect: new Rectangle(0, 0, 0, 0), offsetTop: -1 };
      const rect = pos!.rect as Rectangle;
      pos1.x = pos!.x + rect.width;
      pos1.y = pos!.y + top - 3;
      this.contextMenuPosition.set(index + 1, pos1);
      this.isOpenIndex = index + 1;
      this.showMenu(index + 1);
    }
  }

  onContextMenuLeave(value: ContextMenu, index: number): void {

    if (!value.hasChildren && this.isOpenIndex === index + 1) {
      this.clearSubMenus(index + 1);
    }
  }

  onContextMenuClick(value: ContextMenu): void {

    this.contextMenuActionEvent.emit(value);

    if (value.isEnabled) {
      this.removeMenu();
      switch (value.id) {
        case MenuIDEnum.emCopy: {
          this.gridBody!.cellManipulation!.copy();
          break;
        }
        case MenuIDEnum.emCut: {
          break;
        }
        case MenuIDEnum.emPaste: {
          break;
        }
      }
    }
  }

  clearMenus(): void {
    this.isContextMenu = false;
    this.renderer.setStyle(this.contextMenu!, 'display', 'none');
    this.renderer.setStyle(this.contextMenu!, ' visibility', 'hidden');
    this.renderer.setStyle(this.contextMenu1!, 'display', 'none');
    this.renderer.setStyle(this.contextMenu1!, ' visibility', 'hidden');
    this.renderer.setStyle(this.contextMenu2!, 'display', 'none');
    this.renderer.setStyle(this.contextMenu2!, ' visibility', 'hidden');
    this.contextMenus.delete(0);
  }

  private clearSubMenus(index: number): void {
    for (let i = index; i < 5; i++) {

      this.contextMenus.delete(i);
      this.contextMenuPosition.delete(i);

      const tmp = this.currentMenuHTMLDivElement(i);
      if (tmp) {
        this.renderer.setStyle(tmp, 'display', 'none');
        this.renderer.setStyle(tmp, ' visibility', 'hidden');
      }
    }
  }

  removeMenu(): void {
    if (this.isContextMenu) {
      this.clearMenus();
    }
  }

  private currentMenuHTMLDivElement(index: number): HTMLDivElement | null | undefined {
    let tmp: any = undefined;
    switch (index) {
      case 0:
        return this.contextMenu;
      case 1:
        return this.contextMenu1;
      case 2:
        return this.contextMenu2;
        case 3:
        return this.contextMenu3;
        case 4:
        return this.contextMenu4;
        case 5:
        return this.contextMenu5;
      default:
        return undefined;
    }
  }
}
