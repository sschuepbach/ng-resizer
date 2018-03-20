import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';


import { AppComponent } from './app.component';
import { ResizableDirective } from './resizable.directive';
import {FormControl, FormsModule, ReactiveFormsModule} from '@angular/forms';
import { BorderDirective } from './border.directive';


@NgModule({
  declarations: [
    AppComponent,
    ResizableDirective,
    BorderDirective
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
