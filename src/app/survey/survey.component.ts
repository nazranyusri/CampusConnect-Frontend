import { Component, OnInit } from '@angular/core';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { environment } from 'src/environments/environment';
import { JwtDecoderService } from '../services/jwt-decoder.service';
import { SurveyService } from '../services/survey.service';

@Component({
  selector: 'app-survey',
  templateUrl: './survey.component.html',
  styleUrls: ['./survey.component.scss']
})
export class SurveyComponent implements OnInit {
  surveys: Array<any> = [];
  searchKey: string = '';
  defaultAvatar: string = '../../assets/resources/defaultAvatar.png';
  
  constructor(
    private surveyService: SurveyService,
    private ngxService: NgxUiLoaderService,
    private jwtDecode: JwtDecoderService
  ){}

  ngOnInit(){
    this.ngxService.start();
    this.getAllSurvey();
    const token = localStorage.getItem('token');
  }

  getAllSurvey(){
    this.surveyService.getAllSurvey().subscribe((result: any) => {
        this.ngxService.stop();
        this.surveys = result.map((survey: any) => {
          if (survey.profileImage) {
            survey.profileImage = `${environment.apiUrl}/${survey.profileImage}`;
          }
          return survey;
        });
      },
      (error: any) => {
        this.ngxService.stop();
        console.error(error);
      }
    );
  }
}
