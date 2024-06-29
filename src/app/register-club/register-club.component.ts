import { Component } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ValidatorFn, Validators } from '@angular/forms';
import { UserService } from '../services/user.service';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { SnackbarService } from '../services/snackbar.service';
import { Router } from '@angular/router';
import { GlobalConstants } from '../shared/global-constants';


@Component({
  selector: 'app-register-club',
  templateUrl: './register-club.component.html',
  styleUrls: ['./register-club.component.scss']
})
export class RegisterClubComponent {
  registerForm: any = FormGroup;
  responseMessage: any;

  constructor(private formBuilder: FormBuilder,
    private userService: UserService,
    private ngxService: NgxUiLoaderService,
    private snackbarService: SnackbarService,
    private router: Router) { }

  ngOnInit() {
    this.registerForm = this.formBuilder.group({
      username: ['', [Validators.required, Validators.pattern(GlobalConstants.usernameRegex)]],
      fullName: ['', Validators.required],
      matricNo: ['', Validators.required],
      telNo: ['', [Validators.required, Validators.pattern(GlobalConstants.phoneRegex)]],
      email: ['', [Validators.required, Validators.pattern(GlobalConstants.emailRegex)]],
      password: ['', [Validators.required, Validators.pattern(GlobalConstants.passwordRegex)]],
      confirmPassword: ['', [Validators.required]],
    },
    {
      validators: this.passwordMatchValidator('password', 'confirmPassword'),
    });
  }

  passwordMatchValidator(controlName: string, matchingControlName: string): ValidatorFn {
    return (abstractControl: AbstractControl) => {
      const control = abstractControl.get(controlName);
      const matchingControl = abstractControl.get(matchingControlName);

      if (matchingControl!.errors && !matchingControl!.errors?.['confirmedValidator']) {
        return null;
      }

      if (control!.value !== matchingControl!.value) {
        const error = { passwordMatchValidator: true };
        matchingControl!.setErrors(error);
        return error;
      } else {
        matchingControl!.setErrors(null);
        return null;
      }
    }
  }

  register() {
    this.ngxService.start();
    var formData = this.registerForm.value;
    var data = {
      username: formData.username,
      fullName: formData.fullName,
      matricNo: formData.matricNo,
      telNo: formData.telNo,
      email: formData.email,
      password: formData.password,
    }
    // console.log(data);

    this.userService.registerClub(data).subscribe((result: any) => {
      this.ngxService.stop();
      this.router.navigate(['/homepage']);
      this.snackbarService.openSnackBar(result.message);
    }, (error) => {
      this.ngxService.stop();
      if (error.error?.message) {
        this.responseMessage = error.error?.message;
      }
      else {
        this.responseMessage = GlobalConstants.genericError;
      }
      this.router.navigate(['/registerclub']);
      this.snackbarService.openSnackBar(this.responseMessage);
    })
  }
}