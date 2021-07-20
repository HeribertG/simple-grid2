import { Component, Input, OnInit } from '@angular/core';
import { GridData } from '../gridClasses/data-grid';

@Component({
  selector: 'app-active-cell',
  templateUrl: './active-cell.component.html',
  styleUrls: ['./active-cell.component.scss']
})
export class ActiveCellComponent implements OnInit {

  @Input() gridData: GridData | undefined | null;
  constructor() { }

  ngOnInit(): void {
  }

}
