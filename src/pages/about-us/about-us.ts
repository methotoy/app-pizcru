import { Component, OnInit } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { trigger, state, style, transition, animate } from '@angular/animations';

import { AppServiceProvider } from './../../providers/app-service/app-service';

/**
 * Generated class for the AboutUsPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-about-us',
  templateUrl: 'about-us.html',
  animations: [
		trigger('fade', [
			state('visible', style({
				opacity: 1
			})),
			state('invisible', style([{
				opacity: 0, display: 'none'
			}])),
			transition('* => *', animate('1s'))
		])
	]
})
export class AboutUsPage implements OnInit {

  public aboutUsData = null;

  constructor(
    private navCtrl: NavController,
    private navParams: NavParams,
    private appService: AppServiceProvider
  ) { }

  ionViewDidLoad() {
    console.log('ionViewDidLoad AboutUsPage');
  }

  ngOnInit() {
    this.appService.getCms('about-us')
      .subscribe(
      (response) => {
        let responseData = (response && response.length > 0) ? response[0] : response;
        if (typeof (responseData) && 'cmsContent' in responseData) {
          this.aboutUsData = responseData.cmsContent.split('..').join('https://pizzacrust.com.pk');
        }
      },
      (error) => console.error(error)
      );
  }

}
