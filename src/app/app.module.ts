import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { BodyGridComponent } from './base/body-grid/body-grid.component';
import { HScrollbarComponent } from './base/h-scrollbar/h-scrollbar.component';
import { VScrollbarComponent } from './base/v-scrollbar/v-scrollbar.component';

@NgModule({
  declarations: [
    AppComponent,
    BodyGridComponent,
    HScrollbarComponent,
    VScrollbarComponent
  ],
  imports: [
    BrowserModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
