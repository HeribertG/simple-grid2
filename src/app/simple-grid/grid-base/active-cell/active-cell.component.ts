import { Component, Input, OnDestroy, OnInit, Renderer2 } from '@angular/core';
import { Rectangle } from '../../helpers/geometry';
import { GridData } from '../gridClasses/data-grid';

@Component({
  selector: 'app-active-cell',
  templateUrl: './active-cell.component.html',
  styleUrls: ['./active-cell.component.scss']
})
export class ActiveCellComponent implements OnInit, OnDestroy {

  @Input() gridData: GridData | undefined | null;

  private cellContainer: HTMLInputElement | undefined | null;
  constructor(private renderer: Renderer2,) { }

  ngOnInit(): void {
    this.cellContainer = document.getElementById('edit-cell') as HTMLInputElement;
  }

  ngOnDestroy(): void {
    this.cellContainer = undefined;
  }

  onMouseEnter(event: MouseEvent): void { this.stopEvent(event); }
  onMouseLeave(event: MouseEvent): void { this.stopEvent(event); }
  onMouseDown(event: MouseEvent): void { this.stopEvent(event); }
  onMouseClick(event: MouseEvent): void { this.stopEvent(event); }
  onMouseUp(event: MouseEvent): void { this.stopEvent(event); }
  onMouseMove(event: MouseEvent): void { this.stopEvent(event); }
  onKeyDown(event: KeyboardEvent): void {
    this.stopEvent(event);
  }
  onKeyUp(event: KeyboardEvent): void { this.stopEvent(event); }
  onKeyPress(event: KeyboardEvent): void { this.stopEvent(event); }


  private stopEvent(event: any): void {
    if (event.stopPropagation)
      event.stopPropagation();

  }

  showCell(rect: Rectangle) {
    this.renderer.setStyle(this.cellContainer!, 'top', rect.top + 'px');
    this.renderer.setStyle(this.cellContainer!, 'left', rect.left + 'px');
    this.renderer.setStyle(this.cellContainer!, 'width', rect.width + 'px');
    this.renderer.setStyle(this.cellContainer!, 'height', rect.height + 'px');
    this.renderer.setStyle(this.cellContainer!, 'display', 'block');
    this.renderer.setStyle(this.cellContainer!, 'visibility', 'visible');

    this.cellContainer!.focus()

  }
  hideCell() {
    this.renderer.setStyle(this.cellContainer!, 'display', 'none');
    this.renderer.setStyle(this.cellContainer!, 'visibility', 'hidden');
  }
}
