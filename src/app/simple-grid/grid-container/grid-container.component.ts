import { Component, OnDestroy, OnInit } from '@angular/core';
import { GridData } from '../grid-base/gridClasses/data-grid';
import { GridCellContextMenu } from '../grid-base/gridClasses/grid-cell-context-menu';
import { GridSetting } from '../grid-base/gridClasses/grid-setting';
import { MergeCell } from '../grid-base/gridClasses/merge-cell';
import { Position } from '../grid-base/gridClasses/position';
import { ScrollGrid } from '../grid-base/gridClasses/scroll-grid';

@Component({
  selector: 'app-grid-container',
  templateUrl: './grid-container.component.html',
  styleUrls: ['./grid-container.component.scss']
})
export class GridContainerComponent implements OnInit, OnDestroy {

  private gridSetting: GridSetting | undefined | null = new GridSetting();
  public gridData: GridData | undefined | null = new GridData(this.gridSetting!);
  public scrollGrid: ScrollGrid | undefined | null = new ScrollGrid();
  public gridCellContextMenu: GridCellContextMenu | undefined | null = new GridCellContextMenu(this.gridData!);
  constructor() { }

  ngOnInit(): void {

    const mergeCell = new MergeCell();
    mergeCell.position = new Position(0, 0);
    mergeCell.colSpan = 2;
    mergeCell.rowSpan = 2;
    this.gridData!.mergeCellCollection!.add(mergeCell)
  }

  ngOnDestroy(): void {

    this.gridCellContextMenu!.destroy();
    this.gridCellContextMenu= undefined;
    this.gridSetting = undefined;
    this.gridData!.destroy();
    this.gridData = undefined;
  }
}
