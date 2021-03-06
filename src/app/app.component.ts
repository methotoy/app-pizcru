import { Component, ViewChild } from '@angular/core';
import { Nav, Platform, AlertController } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { AppServiceProvider } from './../providers/app-service/app-service';
import { Storage } from '@ionic/storage'; 

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  @ViewChild(Nav) nav: Nav;

  rootPage: string = 'HomePage';

  mainPages: any[] = [];
  otherPages: any[] = [];

  constructor(
    public platform: Platform,
    public statusBar: StatusBar,
    public splashScreen: SplashScreen,
    private appService: AppServiceProvider,
    private storage: Storage,
    private alertCtrl: AlertController
  ) {
    this.initializeApp();

    // used for an example of ngFor and navigation
    this.mainPages = [
      { title: 'Home', icon: 'home', component: 'HomePage' },
      { title: 'Categories', icon: 'list-box', component: 'CategoryPage' },
      { title: 'Deals', icon: 'thumbs-up', component: 'DealsPage' },
      { title: 'Pizza Builder', icon: 'pizza', component: 'BuilderPage' },
      { title: 'Favorites', icon: 'star', component: 'FavoritesPage' },
      { title: 'Cart', icon: 'cart', component: 'CartPage' },
    ];

    this.otherPages = [
      { title: 'About Us', icon: 'alert', component: 'AboutUsPage' },
      { title: 'Contact Us', icon: 'call', component: 'ContactUsPage' },
      { title: 'Terms of Use', icon: 'paper', component: 'TermsOfUsePage' },
    ];

  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      this.splashScreen.hide();
    });
    this.storage.set('cart', null);

  }

  openPage(page) {
    this.nav.setRoot(page.component);
  }

}
