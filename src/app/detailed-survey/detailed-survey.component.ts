import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { environment } from 'src/environments/environment';
import { JwtDecoderService } from '../services/jwt-decoder.service';
import { SurveyService } from '../services/survey.service';

@Component({
  selector: 'app-detailed-survey',
  templateUrl: './detailed-survey.component.html',
  styleUrls: ['./detailed-survey.component.scss']
})
export class DetailedSurveyComponent {
  userId: number = 0;
  id: number = 0;
  survey: any;
  token: any;
  defaultAvatar: string = '../../assets/resources/defaultAvatar.png';

  constructor(
    private surveyService: SurveyService,
    private route: ActivatedRoute,
    private ngxService: NgxUiLoaderService,
    private jwtDecode: JwtDecoderService,
  ) { }

  ngOnInit() {
    //Accessing the id parameter from route parameters
    this.route.params.subscribe(params => {
      this.id = +params['surveyId'];
      this.ngxService.start();
      // console.log("Survey id from params: ", this.id);
      this.getSurveyById(this.id);
    });
    
    // Get user id
    this.token = localStorage.getItem('token');
    if (this.token) {
      const decodedToken = this.jwtDecode.decodeToken(this.token);
      this.userId = decodedToken?.userId || 0;
    }
  }

  getSurveyById(surveyId: number) {
    this.surveyService.getSurveyById(surveyId).subscribe((result: any) => {
        this.ngxService.stop();
        this.survey = result;
        if (result.profileImage) {
          result.profileImage = `${environment.apiUrl}/${result.profileImage}`;
        }
      },
      (error: any) => {
        this.ngxService.stop();
        console.error(error);
      }
    );
  }
}
