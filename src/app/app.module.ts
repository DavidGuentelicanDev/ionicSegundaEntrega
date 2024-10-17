import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';

//importacion para APIs
import { HttpClientModule } from '@angular/common/http';

//importacion para sqlite
import { SQLite } from '@awesome-cordova-plugins/sqlite/ngx';

@NgModule({
  declarations: [AppComponent],
  imports: [BrowserModule, IonicModule.forRoot(), AppRoutingModule, HttpClientModule], //agregar HttpClieteModule para Apis
  providers: [{ provide: RouteReuseStrategy, useClass: IonicRouteStrategy }, SQLite], //agregar sqlite aca
  bootstrap: [AppComponent],
})
export class AppModule {}
