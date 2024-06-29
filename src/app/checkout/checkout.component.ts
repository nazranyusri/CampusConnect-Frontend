import { Component, Inject } from '@angular/core';
import { AbstractControl, FormArray, FormBuilder, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { BusinessService } from '../services/business.service';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { loadStripe } from '@stripe/stripe-js';
import { JwtDecoderService } from '../services/jwt-decoder.service';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.scss']
})
export class CheckoutComponent {
  businessId: number = 0;
  menuItems: Array<any> = [];
  selectedItems: Array<any> = [];
  totalPrice: number = 0;
  checkoutForm: any = FormGroup;
  userId: number = 0;

  // constructor(
  //   private route: ActivatedRoute,
  //   private businessService: BusinessService,
  //   private formBuilder: FormBuilder,
  //   private ngxService: NgxUiLoaderService,
  //   private jwtDecode: JwtDecoderService
  // ) { }

  // ngOnInit(): void {
  //   this.route.params.subscribe(params => {
  //     this.businessId = +params['businessId'];
  //     console.log(this.businessId); 
  //   });

  //   const token = localStorage.getItem('token');
  //   if(token){
  //     const decodedToken = this.jwtDecode.decodeToken(token);
  //     this.userId = decodedToken?.userId || 0;
  //   }

  //   this.checkoutForm = this.formBuilder.group({
  //     items: this.formBuilder.array([]),
  //   });

  //   this.getMenuItems(this.businessId);

  // }

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private businessService: BusinessService,
    private formBuilder: FormBuilder,
    private ngxService: NgxUiLoaderService,
    private jwtDecode: JwtDecoderService
  ) {
    this.businessId = data.businessId;
  }

  ngOnInit(): void {
    const token = localStorage.getItem('token');
    if(token){
      const decodedToken = this.jwtDecode.decodeToken(token);
      this.userId = decodedToken?.userId || 0;
    }

    this.checkoutForm = this.formBuilder.group({
      items: this.formBuilder.array([]),
    });

    this.getMenuItems(this.businessId);
  }

  getMenuItems(businessId: number) {
    this.businessService.getMenuItems(businessId).subscribe((result: any) => {
      this.menuItems = result;
      console.log(this.menuItems);

      const itemsFormArray = this.checkoutForm.get('items') as FormArray;
      this.menuItems.forEach(item => {
        const itemFormGroup = this.formBuilder.group({
          quantity: [0, Validators.required]
        });
        itemsFormArray.push(itemFormGroup);
      });
    });
  }

  getAvailableQuantities(quantity: number){
    const availableQuantities = [];
    availableQuantities.push(0);
    for(let i = 1; i <= quantity; i++) {
      availableQuantities.push(i);
    }
    return availableQuantities;
  }

  updateSelectedItems(){
    const itemsFormArray = this.checkoutForm.get('items') as FormArray;
    this.selectedItems = [];
    itemsFormArray.controls.forEach((control, index) => {
      const quantity = control.get('quantity')?.value;
      if (quantity !== 0) {
        this.selectedItems.push({
          ...this.menuItems[index],  // Include all properties of the item
          quantity: quantity  // Include the selected quantity
        });
      }
    });

    this.checkoutForm.updateValueAndValidity();
  }

  calculateTotalPrice() {
    let totalPrice = 0;
    const itemsFormArray = this.checkoutForm.get('items') as FormArray;
    itemsFormArray.controls.forEach((itemFormGroup, index) => {
      const quantity = itemFormGroup.get('quantity')?.value;
      const price = this.menuItems[index].price;
      totalPrice += quantity * price;
    });
    this.totalPrice = totalPrice;
  }

  onCheckout() {
    this.ngxService.start();
    
    console.log(this.selectedItems);
    // Prepare data to send
    const data = {
      userId: this.userId,
      items: this.selectedItems  // Send the selected items with their quantities to the backend
    };
  
    //Send checkout request
    this.businessService.checkout(data).subscribe(async (result: any) => {
      let stripe = await loadStripe('pk_test_51PSuTnKOIavqEBhSWKb3m1Qzynq9CqxdWSn6vIY6TsM1iBnDeUaljxJxJUCrTm1nnDjLY1wAecWnAPG3xARSAeVi00NPgUPx3z');
      stripe?.redirectToCheckout({
        sessionId: result.id
      });
      this.ngxService.stop();
      console.log(result);
    },
    (error: any) => {
      console.error(error);
    });
  }
}