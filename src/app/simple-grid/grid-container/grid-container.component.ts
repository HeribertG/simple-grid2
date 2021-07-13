import { Component, OnInit } from '@angular/core';
import { GridData } from '../grid-base/gridClasses/data-grid';
import { GridSetting } from '../grid-base/gridClasses/grid-setting';
import { MergeCell } from '../grid-base/gridClasses/merge-cell';
import { Position } from '../grid-base/gridClasses/position';

@Component({
  selector: 'app-grid-container',
  templateUrl: './grid-container.component.html',
  styleUrls: ['./grid-container.component.scss']
})
export class GridContainerComponent implements OnInit {

  public gridData: GridData | undefined | null = new GridData();
  public gridSetting: GridSetting | undefined | null = new GridSetting();
  

  constructor() { }

  ngOnInit(): void {

    const mergeCell = new MergeCell();
    mergeCell.position=new Position(0,0);
    mergeCell.colSpan =2;
    mergeCell.rowSpan =2;
    this.gridData!.mergeCellCollection.add(mergeCell)
  }

}
