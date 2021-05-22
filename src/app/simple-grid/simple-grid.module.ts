import { LOCALE_ID, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GridContainerComponent } from './grid-container/grid-container.component';
import { FormsModule } from '@angular/forms';
import { HScrollbarComponent } from './grid-base/h-scrollbar/h-scrollbar.component';
import { GridBodyComponent } from './grid-base/grid-body/grid-body.component';
import { VScrollbarComponent } from './grid-base/v-scrollbar/v-scrollbar.component';



@NgModule({
  declarations: [
    GridContainerComponent,
    HScrollbarComponent,
    VScrollbarComponent,
    GridBodyComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    
    
  ],
  exports: [
    GridContainerComponent,
    HScrollbarComponent,
    VScrollbarComponent,
    GridBodyComponent
  ],
  providers: [
    { provide: LOCALE_ID, useValue: 'de-CH' },
  ],
})
export class SimpleGridModule { }
