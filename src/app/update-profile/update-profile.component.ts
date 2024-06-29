import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserService } from '../services/user.service';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { SnackbarService } from '../services/snackbar.service';
import { ActivatedRoute, Router } from '@angular/router';
import { JwtDecoderService } from '../services/jwt-decoder.service';
import { GlobalConstants } from '../shared/global-constants';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-update-profile',
  templateUrl: './update-profile.component.html',
  styleUrls: ['./update-profile.component.scss']
})
export class UpdateProfileComponent {
  userIdOfProfile: number = 0;
  userForm: any = FormGroup;
  responseMessage: any;
  userId: number = 0;
  image: any;
  imagePath: string = '';

  constructor(
    private formBuilder: FormBuilder,
    private userService: UserService,
    private ngxService: NgxUiLoaderService,
    private snackbarService: SnackbarService,
    private route: ActivatedRoute,
    private router: Router,
    private jwtDecode: JwtDecoderService
  ) { }

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.userId = +params['userId'];
      this.ngxService.start();
      // console.log("User ID:", this.userId);
      this.getUser(this.userId);
    });

    this.userForm = this.formBuilder.group({
      email: [''],
      username: ['', [Validators.required, Validators.pattern(GlobalConstants.usernameRegex)]],
      fullName: ['', Validators.required],
      matricNo: ['', Validators.required],
      telNo: ['', [Validators.required, Validators.pattern(GlobalConstants.phoneRegex)]],
      image: ['']
    });
  }

  onImageSelected(event: any) {
    if (event.target.files.length > 0) {
      const file = event.target.files[0];
      this.image = file;
      this.imagePath = `${environment.apiUrl}/${this.image}`;
      console.log(this.image);
      console.log(this.imagePath);

      var reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = (event: any) => {
        this.imagePath = event.target.result;
      }
    }
  }

  getUser(userId: number): void {
    this.ngxService.start();
    this.userService.getUser(userId).subscribe((user: any) => {
        this.userForm.patchValue({
          email: user[0].email,
          username: user[0].username,
          fullName: user[0].fullName,
          matricNo: user[0].matricNo,
          telNo: user[0].telNo,
        });
        this.image = user[0].image;
        this.imagePath = `${environment.apiUrl}/${this.image}`;

        // console.log("User:", user);
        // console.log("User:", this.userForm.value);
        this.userIdOfProfile = user[0].userId;
        const token = localStorage.getItem('token');
        const decodedToken = token ? this.jwtDecode.decodeToken(token) : null;
        const userIdLoggedIn = decodedToken?.userId;
        // console.log("User ID of Profile:", this.userIdOfProfile, "User ID Logged In:", userIdLoggedIn);
        if (this.userIdOfProfile && this.userIdOfProfile !== userIdLoggedIn) {
          // console.log("Created by in if:", this.userId);
          this.router.navigate(['/forbidden']);
        }
        this.ngxService.stop();
      },
      error => {
        console.error('Error loading survey details:', error);
        this.ngxService.stop();
      }
    );
  }

  updateProfile() {
    this.ngxService.start();
    const userId = this.userId.toString();
    if (this.userIdOfProfile) {
      const formData = new FormData();
      formData.append('userId', userId);
      formData.append('username', this.userForm.get('username').value);
      formData.append('fullName', this.userForm.get('fullName').value);
      formData.append('matricNo', this.userForm.get('matricNo').value);
      formData.append('telNo', this.userForm.get('telNo').value);
      formData.append('image', this.image);
  
      formData.forEach((value, key) => {
        console.log(`${key}:`, value);
      });

      this.userService.updateProfile(formData).subscribe((result: any) => {
        this.ngxService.stop();
        this.router.navigate(['/profile']);
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
