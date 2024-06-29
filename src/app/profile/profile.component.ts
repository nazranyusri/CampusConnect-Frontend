import { Component, OnInit } from '@angular/core';
import { UserService } from '../services/user.service';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { ProgramService } from '../services/program.service';
import { BusinessService } from '../services/business.service';
import { SurveyService } from '../services/survey.service';
import { environment } from 'src/environments/environment';
import { JwtDecoderService } from '../services/jwt-decoder.service';
import { ConfirmationDialogComponent } from '../confirmation-dialog/confirmation-dialog.component';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { SnackbarService } from '../services/snackbar.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {
  isAuthorized: boolean = false;
  panelOpenState = false;
  userDetails: any;
  defaultAvatar: string = '../../assets/resources/defaultAvatar.png';
  programs: Array<any> = [];
  businesses: Array<any> = [];
  surveys: Array<any> = [];
  registeredPrograms: Array<any> = [];
  orderedBusiness: Array<any> = [];

  constructor(
    private userService: UserService,
    private programService: ProgramService,
    private businessService: BusinessService,
    private surveyService: SurveyService,
    private ngxService: NgxUiLoaderService,
    private jwtDecode: JwtDecoderService,
    private dialog: MatDialog,
    private snackbarService: SnackbarService
  ) { }

  ngOnInit() {
    this.ngxService.start();
    const token = localStorage.getItem('token');
    if (token) {
      const decodedToken = this.jwtDecode.decodeToken(token);
      const userId = decodedToken?.userId || 0;
      const role = decodedToken?.role || '';
      if (role === 'club' || role === 'admin') {
        this.isAuthorized = true;
      }
      // console.log("Updated isClub value:", this.isAuthorized);

      // console.log("Profile component: ", userId, username, decodedToken);
      this.getUserDetails(userId);
      this.getProgramHistory(userId);
      this.getBusinessHistory(userId);
      this.getSurveyHistory(userId);
      this.getUserOrderedBusiness(userId);
      if (!this.isAuthorized) {
        this.getUserRegisteredPrograms(userId);
      }
      
    }
  }

  getUserDetails(userId: number) {
      this.userService.getUser(userId).subscribe((result: any) => {
        this.ngxService.stop();
        this.userDetails = result.map((user: any) => {
            if (user.image) {
                user.image = `${environment.apiUrl}/${user.image}`;
                // console.log("Image URL", user.image);
            }
            return user;
        });
      },
      (error: any) => {
          this.ngxService.stop();
          console.error(error);
      });
  }

  getProgramHistory(userId: number) {
    this.programService.getProgramHistory(userId).subscribe((result: any) => {
      this.ngxService.stop();
      this.programs = result.map((program: any) => {
        program.image = `${environment.apiUrl}/${program.image}`;
        return program;
      });
      // console.log("Programs:", this.programs);
    },
      (error: any) => {
        this.ngxService.stop();
        console.error(error);
      }
    );
  }

  getBusinessHistory(userId: number) {
    this.businessService.getBusinessHistory(userId).subscribe((result: any) => {
      this.ngxService.stop();
      this.businesses = result.map((business: any) => {
        business.image = `${environment.apiUrl}/${business.image}`;
        // console.log(this.businesses);
        return business;
      });
    },
      (error: any) => {
        this.ngxService.stop();
        console.error(error);
      }
    );
  }

  getSurveyHistory(userId: number) {
    this.surveyService.getSurveyHistory(userId).subscribe((result: any) => {
      this.ngxService.stop();
      this.surveys = result;
      // console.log("Surveys:", this.surveys);
      return result;
    },
      (error: any) => {
        this.ngxService.stop();
        console.error(error);
      }
    );
  }

  getUserRegisteredPrograms(userId: number) {
    this.programService.getUserRegisteredPrograms(userId).subscribe((result: any) => {
      // console.log(result);
      this.registeredPrograms = result.map((program: any) => {
        program.image = `${environment.apiUrl}/${program.image}`;
        return program;
      });
    },
      (error: any) => {
        this.ngxService.stop();
        console.error(error);
      }
    );
  }

  getUserOrderedBusiness(userId: number) {
    this.businessService.getUserOrderedBusiness(userId).subscribe((result: any) => {
      this.ngxService.stop();
      // this.orderedBusiness = result;
      this.orderedBusiness = result.map((business: any) => {
        business.businessDetails.image = `${environment.apiUrl}/${business.businessDetails.image}`;
        return business;
      });
      console.log(this.orderedBusiness);
    },
    (error: any) => {
      this.ngxService.stop();
      console.error(error);
    });
  }

  confirmDeleteProgram(id: number, image: string) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.data = {
      message: 'delete the program'
    };

    const imagePathParts = image.split(/[\\/]/);
    const relativeImagePath = imagePathParts[imagePathParts.length - 1];
    
    // console.log("Program ID:", id);
    // console.log("Image path before split:", image);
    // console.log("Image Path:", relativeImagePath);

    const dialogRef = this.dialog.open(ConfirmationDialogComponent, dialogConfig);
    const response = dialogRef.componentInstance.onEmitStatusChange.subscribe((response: any) => {
      dialogRef.close();
        this.programService.deleteProgram(id, relativeImagePath).subscribe((result: any) => {
          this.snackbarService.openSnackBar(result.message);
          this.programs = this.programs.filter(program => program.programId !== id);
          return result;
        },
        (error: any) => {
          console.error(error);
          this.snackbarService.openSnackBar("An error occurred while deleting the program.");
        });
    });

    dialogRef.afterClosed().subscribe(() => {
      response.unsubscribe();
    });
  }

  confirmDeleteBusiness(id: number, image: string) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.data = {
      message: 'delete the business'
    };

    const imagePathParts = image.split(/[\\/]/);
    const relativeImagePath = imagePathParts[imagePathParts.length - 1];

    const dialogRef = this.dialog.open(ConfirmationDialogComponent, dialogConfig);
    const response = dialogRef.componentInstance.onEmitStatusChange.subscribe((response: any) => {
      dialogRef.close();
        this.businessService.deleteBusiness(id, relativeImagePath).subscribe((result: any) => {
          this.snackbarService.openSnackBar(result.message);
          this.businesses = this.businesses.filter(business => business.businessId !== id);
          return result;
        },
        (error: any) => {
          console.error(error);
          this.snackbarService.openSnackBar("An error occurred while deleting the business.");
        });
    });

    dialogRef.afterClosed().subscribe(() => {
      response.unsubscribe();
    });
  }

  confirmDeleteSurvey(id: number) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.data = {
      message: 'delete the survey'
    };

    const dialogRef = this.dialog.open(ConfirmationDialogComponent, dialogConfig);
    const response = dialogRef.componentInstance.onEmitStatusChange.subscribe((response: any) => {
      dialogRef.close();
        this.surveyService.deleteSurvey(id).subscribe((result: any) => {
          this.snackbarService.openSnackBar(result.message);
          this.surveys = this.surveys.filter(survey => survey.surveyId !== id);
          return result;
        },
        (error: any) => {
          console.error(error);
          this.snackbarService.openSnackBar("An error occurred while deleting the survey.");
        });
    });

    dialogRef.afterClosed().subscribe(() => {
      response.unsubscribe();
    });
  }
}
