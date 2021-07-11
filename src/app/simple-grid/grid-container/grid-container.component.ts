import { Component, OnInit } from '@angular/core';
import { GridData } from '../grid-base/gridClasses/data-grid';
import { GridSetting } from '../grid-base/gridClasses/grid-setting';

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
  }

}
