import { Component, OnInit } from '@angular/core';
import { ProgramService } from '../services/program.service';
import { BusinessService } from '../services/business.service';
import { SurveyService } from '../services/survey.service';
import { animate, style, transition, trigger } from '@angular/animations';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-homepage',
  templateUrl: './homepage.component.html',
  styleUrls: ['./homepage.component.scss'],
})
export class HomepageComponent implements OnInit {
  programCount: any;
  businessCount: any;
  surveyCount: any;
  latestProgram: Array<any> = [];
  latestBusiness: Array<any> = [];
  latestSurvey: Array<any> = [];
  defaultAvatar: string = '../../assets/resources/defaultAvatar.png';

  constructor(
    private programService: ProgramService,
    private businessService: BusinessService,
    private surveyService: SurveyService
  ) { }

  ngOnInit() {
    this.getTotalProgram();
    this.getTotalBusiness();
    this.getTotalSurvey();

    this.getLatestProgram();
    this.getLatestBusiness();
    this.getLatestSurvey();
  }

  getTotalProgram() {
    this.programService.getTotalProgram().subscribe((result: any) => {
        this.programCount = result.totalProgram;
        // console.log('Program count:', this.programCount);
      },
      (error) => {
        console.error('Error fetching total programs:', error);
      }
    );
  }

  getTotalBusiness() {
    this.businessService.getTotalBusiness().subscribe((result: any) => {
      this.businessCount = result.totalBusiness;
      // console.log('Business count:', this.businessCount);
    },
      (error) => {
        console.error('Error fetching total businesses:', error);
      }
    );
  }

  getTotalSurvey() {
    this.surveyService.getTotalSurvey().subscribe((result: any) => {
      this.surveyCount = result.totalSurvey;
      // console.log('Survey count:', this.surveyCount);
    },
      (error) => {
        console.error('Error fetching total surveys:', error);
      }
    );
  }

  getLatestProgram() {
    this.programService.getLatestProgram().subscribe((result: any) => {
      this.latestProgram = result.map((program: any) => {
        program.image = `${environment.apiUrl}/${program.image}`;
        if(program.profileImage) {
          program.profileImage = `${environment.apiUrl}/${program.profileImage}`;
        }
        return program;
      });
      // console.log('Latest program:', result);
    },
      (error) => {
        console.error('Error fetching latest program:', error);
      }
    );
  }

  getLatestBusiness() {
    this.businessService.getLatestBusiness().subscribe((result: any) => {
      this.latestBusiness = result.map((business: any) => {
        business.image = `${environment.apiUrl}/${business.image}`;
        if(business.profileImage) {
          business.profileImage = `${environment.apiUrl}/${business.profileImage}`;
        }
        return business;
      });
      // console.log('Latest business:', result);
    },
      (error) => {
        console.error('Error fetching latest business:', error);
      }
    );
  }

  getLatestSurvey() {
    this.surveyService.getLatestSurvey().subscribe((result: any) => {
      this.latestSurvey = result.map((survey: any) => {
        if (survey.profileImage) {
          survey.profileImage = `${environment.apiUrl}/${survey.profileImage}`;
        }
        return survey;
      });
      // console.log('Latest survey:', result);
    },
      (error) => {
        console.error('Error fetching latest survey:', error);
      }
    );
  }
}
