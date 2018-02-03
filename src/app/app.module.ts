import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';

import { AppComponent } from './app.component';
import { MainPageModule } from './main-page/main-page.module';
import { DetailsPageModule } from './details-page/details-page.module';


@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    MainPageModule,
    DetailsPageModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
