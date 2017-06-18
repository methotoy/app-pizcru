import { BrowserModule } from '@angular/platform-browser';
import { HttpModule } from '@angular/http';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';

import { MyApp } from './app.component';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { BaseProvider } from './../providers/base.service';
import { BannerServiceProvider } from '../providers/banner-service/banner-service';
import { CategoryServiceProvider } from '../providers/category-service/category-service';
import { ProductServiceProvider } from '../providers/product-service/product-service';

@NgModule({
  declarations: [
    MyApp
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp),
    HttpModule
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp
  ],
  providers: [
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    BaseProvider,
    BannerServiceProvider,
    CategoryServiceProvider,
    ProductServiceProvider
  ]
})
export class AppModule {}
