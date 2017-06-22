import { Component, OnInit } from '@angular/core';
import { IonicPage, ViewController, NavParams, Platform, NavController, LoadingController } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { ProductServiceProvider } from './../../providers/product-service/product-service';
import { DealServiceProvider } from './../../providers/deal-service/deal-service';
import { Product } from './../../models/product.interface';
import { Deal } from './../../models/deal.interface';
import { Observable } from 'rxjs';
import 'rxjs/add/observable/from';

/**
 * Generated class for the ProductDetailsPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-product-details',
  templateUrl: 'product-details.html'
})
export class ProductDetailsPage implements OnInit {
  private productId: number | string;
  public productName: string;
  public prevPageTitle: string;
  public productType: string = null;

  public product: Product[] | Deal[];

  // For Products Like Pizza etc.
  public sizeSelected: string;
  public quantitySelected: number = 1;
  private productPrice: number = 0;
  private productImage: string;

  // For Deals
  public selectedDeal: any[] = [];
  public limitDeal: any[] = [];
  private dealImage: string = null;
  private dealPrice: string | number;


  constructor(
    private viewCtrl: ViewController,
    private navParams: NavParams,
    private plt: Platform,
    private productService: ProductServiceProvider,
    private dealService: DealServiceProvider,
    private navCtrl: NavController,
    private strg: Storage,
    private loadingCtrl: LoadingController
  ) {
    this.productId = navParams.get('productId');
    this.productName = navParams.get('productName');
    this.prevPageTitle = navParams.get('prevPageTitle');
    this.productType = (navParams.get('type')) ? navParams.get('type') : null;
  }

  ngOnInit() {
    if (this.productType && this.productType === 'deals') {
      this.product = Observable.from(this.dealService.deals)
        .mergeAll()
        .filter((data) => data.dealID === this.productId);

      Observable.from(this.dealService.deals)
        .flatMap((res) => res)
        .filter((data) => data.dealID === this.productId)
        .subscribe(
        (data) => {
          this.limitDeal = data.numberofitem;
          this.dealImage = data.dealImage;
          this.dealPrice = data.dealPrice;
          if (data.numberofitem) {
            for (let key in data.numberofitem) {
              for (let i = 0; i < parseInt(data.numberofitem[key]); i++) {
                this.selectedDeal.push({ id: key, productId: null, productName: null });
              }
            }
          }
        }
        );
    } else {
      this.product = Observable.from(this.productService.product)
        .mergeAll()
        .filter((data) => data.iProductId === this.productId);

      Observable.from(this.productService.product)
        .flatMap((res) => res)
        .filter((data) => data.iProductId === this.productId)
        .subscribe(
        (data) => {
          this.productImage = data.vImage;
        }
        );
    }
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ProductDetailsPage');
  }

  getSizes(data) {
    let tempData = JSON.parse(data);
    if (tempData && !this.sizeSelected) {
      this.sizeSelected = tempData[0].vName;
    }
    return tempData;
  }

  updateSizeSelected(sizeName, price) {
    this.sizeSelected = sizeName;
    this.productPrice = price;
  }

  updateQuantitySelected(quantity) {
    this.quantitySelected = quantity;
  }

  updateSelectedDealProduct(data: Product) {
    let exist = this.selectedDeal.findIndex(item => item.id === data.iCategoryId && item.productId === data.iProductId);
    let index = this.selectedDeal.findIndex(item => item.id === data.iCategoryId && item.productId === null);
    if (exist < 0 && index > -1) {
      this.selectedDeal[index].productId = data.iProductId;
      this.selectedDeal[index].productName = data.vName;
    } else {
      if (exist < 0) {
        index = this.selectedDeal.findIndex(item => item.id === data.iCategoryId && item.productId !== data.iProductId);
        this.selectedDeal[index].productId = data.iProductId;
        this.selectedDeal[index].productName = data.vName;
      } else {
        this.selectedDeal[exist].productId = null;
        this.selectedDeal[exist].productName = null;
      }
    }
  }

  convertToArray(data) {
    if (typeof data) {
      let tempData = [];
      for (let key in data) {
        if (data.hasOwnProperty(key) && data[key].length > 0) {
          tempData.push(parseInt(data[key]));
        }
      }

      tempData.sort();
      return tempData.reverse();
    }

    return data;
  }

  checkSelected(data) {
    let exist = this.selectedDeal.findIndex(item => item.id === data.iCategoryId && item.productId === data.iProductId);

    return (exist > -1) ? true : false;
  }

  checkLimit() {
    let limit = this.selectedDeal.findIndex(item => item.productId === null);
    return (limit > -1) ? true : false;
  }

  dealAddToCart() {
    let loading = this.loadingCtrl.create({
      content: 'Please wait...'
    })

    loading.present();

    let storageData = [];
    let dealData = { 
      product: this.productName || null,
      price: this.dealPrice || 0,
      image: this.dealImage,
      itemSelected: this.selectedDeal
    };

    this.strg.get('cart').then((result) => {
      if (result) {
        storageData = JSON.parse(result);
        storageData.push(dealData);
        this.strg.set('cart', JSON.stringify(storageData));
      } else {
        storageData.push(dealData);
        this.strg.set('cart', JSON.stringify(storageData));
      }

      setTimeout(() => {
        loading.dismiss();
      }, 2000);
    });
  }

  productAddToCart() {
    let loading = this.loadingCtrl.create({
      content: 'Please wait...'
    })

    loading.present();

    let storageData = [];
    let productData = {
      product: this.productName || null,
      price: this.productPrice || 0,
      image: this.productImage,
      size: this.sizeSelected || 0,
      quantity: this.quantitySelected || 0
    };

    this.strg.get('cart').then((result) => {
      if (result) {
        storageData = JSON.parse(result);
        storageData.push(productData);
        this.strg.set('cart', JSON.stringify(storageData));
      } else {
        storageData.push(productData);
        this.strg.set('cart', JSON.stringify(storageData));
      }

      setTimeout(() => {
        loading.dismiss();
      }, 2000);
    });
  }

}
