import { Component, ViewChild } from '@angular/core';
import { Nav, Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  @ViewChild(Nav) nav: Nav;

  rootPage: string = 'HomePage';

  mainPages: any;
  otherPages: any;

  constructor(
    public platform: Platform,
    public statusBar: StatusBar,
    public splashScreen: SplashScreen
  ) {
    this.initializeApp();

    // used for an example of ngFor and navigation
    this.mainPages = [
      { title: 'Home', icon: 'home', component: 'HomePage' },
      { title: 'Categories', icon: 'list-box', component: 'CategoryPage' },
      { title: 'Deals', icon: 'thumbs-up', component: 'DealsPage' },
      { title: 'Pizza Builder', icon: 'pizza', component: 'BuilderPage' },
      { title: 'Favorites', icon: 'star', component: 'MenuPage' },
      { title: 'Cart', icon: 'cart', component: 'CartPage' },
    ];

    this.otherPages = [
      { title: 'About Us', icon: 'alert', component: 'HomePage' },
      { title: 'Contact Us', icon: 'call', component: 'MenuPage' },
      { title: 'Terms of Use', icon: 'paper', component: 'MenuPage' },
    ];

  }

  initializeApp() {
    this.platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      // this.statusBar.styleDefault();
      // this.splashScreen.hide();
    });
  }

  openPage(page) {
    // Reset the content nav to have just this page
    // we wouldn't want the back button to show in this scenario
    this.nav.setRoot(page.component);
  }
}
