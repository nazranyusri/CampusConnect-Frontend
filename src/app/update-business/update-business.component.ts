import { Component } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { BusinessService } from '../services/business.service';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { SnackbarService } from '../services/snackbar.service';
import { ActivatedRoute, Router } from '@angular/router';
import { JwtDecoderService } from '../services/jwt-decoder.service';
import { GlobalConstants } from '../shared/global-constants';
import { environment } from 'src/environments/environment';


@Component({
  selector: 'app-update-business',
  templateUrl: './update-business.component.html',
  styleUrls: ['./update-business.component.scss']
})
export class UpdateBusinessComponent {
  userIdOfBusiness: number = 0;
  businessForm: any = FormGroup;
  responseMessage: any;
  businessId: number = 0;
  image: any;
  imagePath: string = '';
  itemsToDelete: number[] = [];

  constructor(
    private formBuilder: FormBuilder,
    private businessService: BusinessService,
    private ngxService: NgxUiLoaderService,
    private snackbarService: SnackbarService,
    private route: ActivatedRoute,
    private router: Router,
    private jwtDecode: JwtDecoderService
  ) { }

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.businessId = +params['businessId'];
      this.ngxService.start();
      this.getBusinessById(this.businessId);
    });

    this.businessForm = this.formBuilder.group({
      businessTitle: ['', Validators.required],
      telName: ['', Validators.required],
      location: ['', Validators.required],
      tag: ['', Validators.required],
      telNo: ['', [Validators.required, Validators.pattern(GlobalConstants.phoneRegex)]],
      description: ['', Validators.required],
      acceptOrder: [],
      items: this.formBuilder.array([])
    });

    this.addItem();
  }

  get items(): FormArray {
    return this.businessForm.get('items') as FormArray;
  }

  addItem() {
    const itemGroup = this.formBuilder.group({
      itemName: ['', Validators.required],
      price: ['', [Validators.required, Validators.pattern(/^\d+(\.\d{1,2})?$/)]], // Numeric value with optional two decimal places
      quantity: ['', [Validators.required, Validators.pattern(/^[\d-]+$/)]], 
      note: ['']
    });
    this.items.push(itemGroup);
  }

  onImageSelected(event: any) {
      if (event.target.files.length > 0) {
        const file = event.target.files[0];
        this.image = file;
        this.imagePath = `${environment.apiUrl}/${this.image}`;

        var reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = (event: any) => {
          this.imagePath = event.target.result;
      }
    }
  }

  getBusinessById(businessId: number): void {
    this.ngxService.start();
    this.businessService.getBusinessById(businessId).subscribe((business: any) => {
        this.businessForm.patchValue({
          businessTitle: business.businessTitle,
          telName: business.telName,
          location: business.location,
          tag: business.tag,
          telNo: business.telNo,
          description: business.description,
          acceptOrder: business.isAcceptOrder  === 'true'
        });
        this.image = business.image;
        this.imagePath = `${environment.apiUrl}/${this.image}`;

        //frontend authorization
        this.userIdOfBusiness = business.userId;
        const token = localStorage.getItem('token');
        const decodedToken = token ? this.jwtDecode.decodeToken(token) : null;
        const userIdLoggedIn = decodedToken?.userId;
        if (this.userIdOfBusiness && this.userIdOfBusiness !== userIdLoggedIn) {
          // console.log("Created by in if:", this.userId);
          this.router.navigate(['/forbidden']);
        }

        //get menu items
        this.businessService.getMenuItems(businessId).subscribe((menuItems: any) => {
          const itemsFormArray = this.businessForm.get('items') as FormArray;
          itemsFormArray.clear(); 

          menuItems.forEach((menuItem: any) => {
            itemsFormArray.push(
              new FormGroup({
                menuId: new FormControl(menuItem.menuId),
                itemName: new FormControl(menuItem.itemName),
                price: new FormControl(menuItem.price),
                quantity: new FormControl(menuItem.quantity),
                note: new FormControl(menuItem.note)
              })
            );
          });
        }, error => {
          console.error('Error loading menu items:', error);
        });

        this.ngxService.stop();
      },
      error => {
        console.error('Error loading business details:', error);
        this.ngxService.stop();
      }
    );
  }

  updateBusiness() {
    this.ngxService.start();
    const businessId = this.businessId.toString();
    if (this.userIdOfBusiness) {
      const formData = new FormData();
      formData.append('id', businessId);
      formData.append('userId', this.userIdOfBusiness.toString());
      formData.append('businessTitle', this.businessForm.get('businessTitle').value);
      formData.append('location', this.businessForm.get('location').value);
      formData.append('tag', this.businessForm.get('tag').value);
      formData.append('telName', this.businessForm.get('telName').value);
      formData.append('telNo', this.businessForm.get('telNo').value);
      formData.append('image', this.image);
      formData.append('description', this.businessForm.get('description').value);
      formData.append('datePublished', new Date().toISOString());
      formData.append('acceptOrder', this.businessForm.get('acceptOrder').value);

      const items = this.businessForm.get('items')!.value;
      formData.append('items', JSON.stringify(items));
      console.log(formData);
      // console.log(items);

      this.businessService.updateBusiness(formData).subscribe((result: any) => {
        // Delete the items marked for deletion
        this.itemsToDelete.forEach(menuId => {
            this.businessService.deleteMenuItem(menuId).subscribe(() => {
              console.log('Items deleted:', menuId);
                // Optional: Handle successful deletion of each item
            }, (error) => {
                this.responseMessage = error.error?.message;
                this.snackbarService.openSnackBar(this.responseMessage);
            });
        });
        this.ngxService.stop();
        this.router.navigate(['/profile']);
        this.snackbarService.openSnackBar(result.message);
    }, (error) => {
        this.ngxService.stop();
        if (error.error?.message) {
            this.responseMessage = error.error?.message;
        } else {
            this.responseMessage = GlobalConstants.genericError;
        }
        this.snackbarService.openSnackBar(this.responseMessage);
    });
    }
  }

  removeItem(index: number) {
    const menuArray = this.businessForm.get('items') as FormArray;
    const item = menuArray.at(index);

    if (item.get('menuId') && item.get('menuId')?.value) {
        console.log ('Item to delete:', item.get('menuId')?.value);
        this.itemsToDelete.push(item.get('menuId')?.value);
    }
    this.items.removeAt(index);
  }
}