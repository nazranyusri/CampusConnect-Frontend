import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ValidatorFn, Validators } from '@angular/forms';
import { ProgramService } from '../services/program.service';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { SnackbarService } from '../services/snackbar.service';
import { Router } from '@angular/router';
import { GlobalConstants } from '../shared/global-constants';
import { JwtDecoderService } from '../services/jwt-decoder.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-add-program',
  templateUrl: './add-program.component.html',
  styleUrls: ['./add-program.component.scss']
})
export class AddProgramComponent implements OnInit {
  programForm: any = FormGroup;
  responseMessage: any;
  image: any;
  imagePath: string = '';

  constructor(private formBuilder: FormBuilder,
    private programService: ProgramService,
    private ngxService: NgxUiLoaderService,
    private snackbarService: SnackbarService,
    private router: Router,
    private jwtDecode: JwtDecoderService) { }

  ngOnInit() {
    this.programForm = this.formBuilder.group({
      programTitle: ['', Validators.required],
      location: ['', Validators.required],
      startDate: ['', Validators.required],
      endDate: ['', Validators.required],
      startTime: ['', Validators.required],
      endTime: ['', Validators.required],
      telName: ['', Validators.required],
      telNo: ['', [Validators.required, Validators.pattern(GlobalConstants.phoneRegex)]],
      image: ['', Validators.required],
      description: ['', Validators.required],
      tag: ['', Validators.required],
      acceptRegistration: [false]
    },
    {
      validators: this.timeRangeValidator('startTime', 'endTime'),
    });
  }

  timeRangeValidator(startTime: string, endTime: string): ValidatorFn {
    return (abstractControl: AbstractControl) => {
      const control = abstractControl.get(startTime);
      const matchingControl = abstractControl.get(endTime);

      if (matchingControl!.errors && !matchingControl!.errors?.['timeRangeValidator']) {
        return null;
      }

      if (control!.value >= matchingControl!.value) {
        const error = { timeRangeValidator: true };
        matchingControl!.setErrors(error);
        return error;
      } else {
        matchingControl!.setErrors(null);
        return null;
      }
    }
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

  addProgram() {
    this.ngxService.start();
    const token = localStorage.getItem('token');
    const decodedToken = token ? this.jwtDecode.decodeToken(token) : null;
    const userId = decodedToken?.userId;

    const formattedStartDate = new Date(this.programForm.get('startDate').value).toISOString().split('T')[0];
    const formattedEndDate = new Date(this.programForm.get('endDate').value).toISOString().split('T')[0];

    if (userId) {
      const formData = new FormData();
      formData.append('userId', userId.toString());
      formData.append('programTitle', this.programForm.get('programTitle').value);
      formData.append('location', this.programForm.get('location').value);
      formData.append('startDate', formattedStartDate);
      formData.append('endDate', formattedEndDate);
      formData.append('startTime', this.programForm.get('startTime').value);
      formData.append('endTime', this.programForm.get('endTime').value);
      formData.append('telName', this.programForm.get('telName').value);
      formData.append('telNo', this.programForm.get('telNo').value);
      formData.append('image', this.image);
      formData.append('description', this.programForm.get('description').value);
      formData.append('tag', this.programForm.get('tag').value);
      formData.append('datePublished', new Date().toISOString());
      formData.append('acceptRegistration', this.programForm.get('acceptRegistration').value);
      
      // formData.forEach((value, key) => {
        // console.log(`${key}:`, value);
      // });

      this.programService.addProgram(formData).subscribe((result: any) => {
        this.ngxService.stop();
        this.router.navigate(['/program']);
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