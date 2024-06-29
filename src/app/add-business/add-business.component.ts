import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import { GlobalConstants } from '../shared/global-constants';
import { environment } from 'src/environments/environment';
import { JwtDecoderService } from '../services/jwt-decoder.service';
import { Router } from '@angular/router';
import { SnackbarService } from '../services/snackbar.service';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { BusinessService } from '../services/business.service';

@Component({
  selector: 'app-add-business',
  templateUrl: './add-business.component.html',
  styleUrls: ['./add-business.component.scss']
})
export class AddBusinessComponent implements OnInit {
  businessForm: any = FormGroup;
  responseMessage: any;
  image: any;
  imagePath: string = '';

  constructor(
    private formBuilder: FormBuilder,
    private businessService: BusinessService,
    private ngxService: NgxUiLoaderService,
    private snackbarService: SnackbarService,
    private router: Router,
    private jwtDecode: JwtDecoderService
  ) { }

  ngOnInit() {
    this.businessForm = this.formBuilder.group({
      businessTitle: ['', Validators.required],
      telName: ['', Validators.required],
      telNo: ['', [Validators.required, Validators.pattern(GlobalConstants.phoneRegex)]],
      location: ['', Validators.required],
      tag: ['', Validators.required],
      image: ['', Validators.required],
      description: ['', Validators.required],
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
      quantity: ['', [Validators.required, Validators.pattern(/^\d+$/)]], // Numeric value
      note: ['']
    });
    this.items.push(itemGroup);
  }

  removeItem(index: number) {
    this.items.removeAt(index);
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

  addBusiness() {
    // this.ngxService.start();
    const token = localStorage.getItem('token');
    const decodedToken = token ? this.jwtDecode.decodeToken(token) : null;
    const userId = decodedToken?.userId;

    if (userId) {
      const formData = new FormData();
      formData.append('userId', userId?.toString());
      formData.append('businessTitle', this.businessForm.get('businessTitle').value);
      formData.append('location', this.businessForm.get('location').value);
      formData.append('tag', this.businessForm.get('tag').value);
      // formData.append('businessLink', this.businessForm.get('businessLink').value);
      // formData.append('sellingMethod', this.businessForm.get('sellingMethod').value);
      formData.append('telName', this.businessForm.get('telName').value);
      formData.append('telNo', this.businessForm.get('telNo').value);
      formData.append('image', this.image);
      formData.append('description', this.businessForm.get('description').value);
      formData.append('datePublished', new Date().toISOString());

      const items = this.businessForm.get('items')!.value;
      formData.append('items', JSON.stringify(items));

      // formData.forEach((value, key) => {
        // console.log(`${key}:`, value);
      // });

      this.businessService.addBusiness(formData).subscribe((result: any) => {
        this.ngxService.stop();
        this.router.navigate(['/business']);
        this.snackbarService.openSnackBar(result.message);
      }, (error) => {
        this.ngxService.stop();
        if (error.error?.message) {
          this.responseMessage = error.error?.message;
        }
        else {
          this.responseMessage = GlobalConstants.genericError;
        }
        this.snackbarService.openSnackBar(this.responseMessage);
      });
    }
  }
}
