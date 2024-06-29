import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SurveyService } from '../services/survey.service';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { SnackbarService } from '../services/snackbar.service';
import { ActivatedRoute, Router } from '@angular/router';
import { JwtDecoderService } from '../services/jwt-decoder.service';
import { GlobalConstants } from '../shared/global-constants';


@Component({
  selector: 'app-update-survey',
  templateUrl: './update-survey.component.html',
  styleUrls: ['./update-survey.component.scss']
})
export class UpdateSurveyComponent {
  userIdOfSurvey: number = 0;
  surveyForm: any = FormGroup;
  responseMessage: any;
  surveyId: number = 0;
  image: any;
  imagePath: string = '';

  constructor(
    private formBuilder: FormBuilder,
    private surveyService: SurveyService,
    private ngxService: NgxUiLoaderService,
    private snackbarService: SnackbarService,
    private route: ActivatedRoute,
    private router: Router,
    private jwtDecode: JwtDecoderService
  ) { }

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.surveyId = +params['surveyId'];
      this.ngxService.start();
      // console.log("Survey ID:", this.surveyId);
      this.getSurveyById(this.surveyId);
    });

    this.surveyForm = this.formBuilder.group({
      surveyTitle: ['', Validators.required],
      time: ['', [Validators.required, Validators.pattern('^[0-9]*$')]],
      surveyLink: ['', Validators.required],
      description: ['', Validators.required]
    });
  }

  getSurveyById(surveyId: number): void {
    this.ngxService.start();
    this.surveyService.getSurveyById(surveyId).subscribe((survey: any) => {
        this.surveyForm.patchValue({
          surveyTitle: survey.surveyTitle,
          time: survey.time,
          surveyLink: survey.surveyLink,
          description: survey.description
        });

        this.userIdOfSurvey = survey.userId;
        const token = localStorage.getItem('token');
        const decodedToken = token ? this.jwtDecode.decodeToken(token) : null;
        const userIdLoggedIn = decodedToken?.userId;
        if (this.userIdOfSurvey && this.userIdOfSurvey !== userIdLoggedIn) {
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

  updateSurvey() {
    this.ngxService.start();
    const surveyId = this.surveyId.toString();
    if (this.userIdOfSurvey) {
      var formData = this.surveyForm.value;
      var data = {
        surveyId: surveyId,
        surveyTitle: formData.surveyTitle,
        time: formData.time,
        surveyLink: formData.surveyLink,
        description: formData.description,
        datePublished: new Date().toISOString()
      }
      // console.log("Data:", data);
      this.surveyService.updateSurvey(data).subscribe((result: any) => {
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
