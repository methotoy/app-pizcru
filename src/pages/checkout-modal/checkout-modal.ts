import { Component, OnInit } from '@angular/core';
import { IonicPage, ViewController, LoadingController, ToastController } from 'ionic-angular';
import { BranchServiceProvider } from './../../providers/branch-service/branch-service';
import { Observable } from 'rxjs';
import { Storage } from '@ionic/storage';

/**
 * Generated class for the CheckoutModal page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-checkout-modal',
  templateUrl: 'checkout-modal.html',
})
export class CheckoutModal implements OnInit {

  public selectedBranch: any;
  public branches: Observable<Array<any>>;

  public selectedArea: any;
  public areas: any[] = [];

  public selectedPayment: string = 'Cash on Delivery';
  public fullName: string = '';
  public email: string = '';
  public phone: string = '';
  public extraRequest: string = '';
  public address: string = '';
  public coupon: string = '';

  constructor(
    private viewCtrl: ViewController,
    private branchService: BranchServiceProvider,
    private storage: Storage,
    private ldngCtrl: LoadingController,
    private toastCtrl: ToastController
  ) { }

  ngOnInit() {
    this.branches = this.branchService.getBranch();
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad CheckoutModal');
  }

  dismiss() {
    this.viewCtrl.dismiss({
      emptyCart: false
    });
  }

  updateArea(branchArea) {
    this.areas = branchArea.areaData;
  }

  validFields() {
    let valid = false;
    if (this.fullName &&
      this.email &&
      this.phone &&
      this.address &&
      this.selectedBranch &&
      this.selectedArea
    ) {
      valid = true;
    }

    return valid;
  }

  order() {
    let loading = this.ldngCtrl.create({
      content: 'Sending Order Request... Please wait...'
    });

    loading.present();

    let total = 0;
    let itemsz = {};
    this.storage.get('cart').then(
      (result) => {
        let res = JSON.parse(result);
        for (let index in res) {
          let options = [];
          let itemSelected: any[] = res[index].itemSelected || [];
          if (itemSelected.length > 0) {
            for (let i in itemSelected) {
              options.push(itemSelected[i].productName);
            }
          }

          itemsz[res[index].id] = {
            name: res[index].product,
            image: `public_html/upload/${res[index].image}`,
            quantity: res[index].quantity,
            size_name: res[index].size || "",
            price: res[index].price,
            total: parseInt(res[index].price) * (parseInt(res[index].quantity)),
            options: (options.length > 0) ? options : ""
          };
          total += (parseInt(res[index].price) * parseInt(res[index].quantity));
        }

        let data = [{
          customerName: this.fullName,
          email: this.email,
          number: this.phone,
          address: this.address,
          branchId: this.selectedBranch['branchID'],
          areadId: this.selectedArea,
          extraRequest: this.extraRequest,
          payment: this.selectedPayment,
          coupun: this.coupon,
          total: total,
          items: itemsz
        }];

        this.branchService.postOrder(data)
          .subscribe(
          (result) => {
            console.log('status' in result);
            if (result && typeof result === 'object' && 'status' in result && result.status) {
              this.storage.set('cart', null);
              console.log('Empty Cart Storage');
              this.toastCtrl.create({
                message: 'Order successfully sent. Check your email for more information.',
                duration: 4000,
                position: 'bottom'
              }).present();
            } else {
              this.toastCtrl.create({
                message: 'There was an error occured! Please try again!',
                duration: 4000,
                position: 'bottom'
              }).present();
            }
          },
          (error) => {
            loading.dismiss();
            console.error(error);
          },
          () => setTimeout(() => {
            loading.dismiss();
            this.viewCtrl.dismiss({
              emptyCart: true
            });
          }, 1000)
          );
      }
    );
  }

  isEmptyObject(data) {
    return (data === 'null');
  }

}
