import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { SimpleGridModule } from './simple-grid/simple-grid.module';



@NgModule({
  declarations: [
    AppComponent,
 

  ],
  imports: [
    BrowserModule,
    SimpleGridModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
