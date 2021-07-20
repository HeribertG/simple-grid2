import { LOCALE_ID, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GridContainerComponent } from './grid-container/grid-container.component';
import { FormsModule } from '@angular/forms';
import { HScrollbarComponent } from './grid-base/h-scrollbar/h-scrollbar.component';
import { GridBodyComponent } from './grid-base/grid-body/grid-body.component';
import { VScrollbarComponent } from './grid-base/v-scrollbar/v-scrollbar.component';
import { CellEventsDirective } from './grid-base/grid-body/directive/cell-events.directive';
import { SimpleContextMenuComponent } from './simple-context-menu/simple-context-menu.component';
import { ActiveCellComponent } from './grid-base/active-cell/active-cell.component';



@NgModule({
  declarations: [
    GridContainerComponent,
    HScrollbarComponent,
    VScrollbarComponent,
    GridBodyComponent,
    CellEventsDirective,
    SimpleContextMenuComponent,
    ActiveCellComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    
    
    
  ],
  exports: [
    GridContainerComponent,
    HScrollbarComponent,
    VScrollbarComponent,
    GridBodyComponent,
    CellEventsDirective,
    SimpleContextMenuComponent,
    ActiveCellComponent,
  ],
  providers: [
    { provide: LOCALE_ID, useValue: 'de-CH' },
  ],
})
export class SimpleGridModule { }
