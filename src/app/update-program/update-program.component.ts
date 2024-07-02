import { Component } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ValidatorFn, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ProgramService } from '../services/program.service';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { SnackbarService } from '../services/snackbar.service';
import { JwtDecoderService } from '../services/jwt-decoder.service';
import { GlobalConstants } from '../shared/global-constants';
import { environment } from 'src/environments/environment';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-update-program',
  templateUrl: './update-program.component.html',
  styleUrls: ['./update-program.component.scss'],
  providers: [DatePipe]
})
export class UpdateProgramComponent {
  userId: number = 0;
  programForm: any = FormGroup;
  responseMessage: any;
  programId: number = 0;
  image: any;
  imagePath: string = '';

  constructor(
    private formBuilder: FormBuilder,
    private programService: ProgramService,
    private ngxService: NgxUiLoaderService,
    private snackbarService: SnackbarService,
    private route: ActivatedRoute,
    private router: Router,
    private jwtDecode: JwtDecoderService,
    private datePipe: DatePipe
  ) { }

  ngOnInit() {
    // console.log("Created by OnInit:", this.userId);
    this.route.params.subscribe(params => {
      this.programId = +params['id'];
      this.ngxService.start();
      this.getProgramById(this.programId);
    });

    this.programForm = this.formBuilder.group({
      programTitle: ['', Validators.required],
      location: ['', Validators.required],
      startDate: ['', Validators.required],
      endDate: ['', Validators.required],
      startTime: ['', Validators.required],
      endTime: ['', Validators.required],
      telName: ['', Validators.required],
      telNo: ['', [Validators.required, Validators.pattern(GlobalConstants.phoneRegex)]],
      image: [''],
      description: ['', Validators.required],
      tag: ['', Validators.required],
      acceptRegistration: []
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

  convertTo24Hour(time: string): string {
    const [timePart, modifier] = time.split(' ');
    let [hours, minutes] = timePart.split(':');
    
    if (hours === '12') {
      hours = '00';
    }
    
    if (modifier === 'PM') {
      hours = (parseInt(hours, 10) + 12).toString();
    }
    
    return `${hours.padStart(2, '0')}:${minutes}`;
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

  getProgramById(id: number): void {
    this.ngxService.start();
    this.programService.getProgramById(id).subscribe((program: any) => {
        this.programForm.patchValue({
          programTitle: program.programTitle,
          location: program.location,
          startDate: program.startDate,
          endDate: program.endDate,
          startTime: this.convertTo24Hour(program.startTime),
          endTime: this.convertTo24Hour(program.endTime),
          telName: program.telName,
          telNo: program.telNo,
          // image: program.image,
          description: program.description,
          tag: program.tag,
          acceptRegistration: program.isRegister  === 'true'
        });
        this.image = program.image;
        this.imagePath = `${environment.apiUrl}/${this.image}`;
        // console.log("Image Path:", this.imagePath);
        // console.log("Created By:", this.userId);
        console.log(this.programForm.value);
        this.userId = program.userId;
        const token = localStorage.getItem('token');
        const decodedToken = token ? this.jwtDecode.decodeToken(token) : null;
        const userIdOfProgram = decodedToken?.userId;
        if (this.userId && this.userId !== userIdOfProgram) {
          // console.log("Created by in if:", this.userId);
          this.router.navigate(['/forbidden']);
        }
        this.ngxService.stop();
      },
      error => {
        console.error('Error loading program details:', error);
        this.ngxService.stop();
      }
    );
  }

  updateProgram() {
    this.ngxService.start();
    const id = this.programId.toString();

    const formattedStartDate = this.datePipe.transform(this.programForm.get('startDate').value, 'yyyy-MM-dd') || '';
    const formattedEndDate = this.datePipe.transform(this.programForm.get('endDate').value, 'yyyy-MM-dd') || '';

    if (this.userId) {
      const formData = new FormData();
      formData.append('id', id);
      formData.append('userId', this.userId.toString());
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
      formData.append('acceptRegistration', this.programForm.get('acceptRegistration').value);

      // formData.forEach((value, key) => {
      //   console.log(`${key}:`, value);
      // });

      this.programService.updateProgram(formData).subscribe((result: any) => {
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