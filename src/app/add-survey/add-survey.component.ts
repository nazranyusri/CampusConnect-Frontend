import { Component } from '@angular/core';
import { GlobalConstants } from '../shared/global-constants';
import { environment } from 'src/environments/environment';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { JwtDecoderService } from '../services/jwt-decoder.service';
import { Router } from '@angular/router';
import { SnackbarService } from '../services/snackbar.service';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { SurveyService } from '../services/survey.service';

@Component({
  selector: 'app-add-survey',
  templateUrl: './add-survey.component.html',
  styleUrls: ['./add-survey.component.scss']
})
export class AddSurveyComponent {
  surveyForm: any = FormGroup;
  responseMessage: any;

  constructor(private formBuilder: FormBuilder,
    private surveyService: SurveyService,
    private ngxService: NgxUiLoaderService,
    private snackbarService: SnackbarService,
    private router: Router,
    private jwtDecode: JwtDecoderService) { }

  ngOnInit() {
    this.surveyForm = this.formBuilder.group({
      surveyTitle: ['', Validators.required],
      time: ['', [Validators.required, Validators.pattern('^[0-9]*$')]],
      surveyLink: ['', Validators.required],
      description: ['', Validators.required]
    });
  }

  addSurvey() {
    this.ngxService.start();
    const token = localStorage.getItem('token');
    const decodedToken = token ? this.jwtDecode.decodeToken(token) : null;
    const userId = decodedToken?.userId;

    if (userId) {
      var formData = this.surveyForm.value;
      var data = {
        userId: userId,
        surveyTitle: formData.surveyTitle,
        time: formData.time,
        surveyLink: formData.surveyLink,
        description: formData.description,
        datePublished: new Date().toISOString()
      }

      this.surveyService.addSurvey(data).subscribe((result: any) => {
        this.ngxService.stop();
        this.router.navigate(['/survey']);
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
