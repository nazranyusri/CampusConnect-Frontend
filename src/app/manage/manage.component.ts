import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { UserService } from '../services/user.service';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { SnackbarService } from '../services/snackbar.service';
import { ProgramService } from '../services/program.service';
import { BusinessService } from '../services/business.service';
import { SurveyService } from '../services/survey.service';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { ConfirmationDialogComponent } from '../confirmation-dialog/confirmation-dialog.component';

@Component({
  selector: 'app-manage',
  templateUrl: './manage.component.html',
  styleUrls: ['./manage.component.scss']
})
export class ManageComponent implements OnInit{
  clubDisplayedColumns: string[] = ['position', 'username', 'fullName', 'telNo', 'email', 'actions'];
  clubDataSource = new MatTableDataSource<any>();
  clubSearchKey: string = '';

  userDisplayedColumns: string[] = ['position', 'username', 'fullName', 'matricNo', 'email', 'actions'];
  userDataSource = new MatTableDataSource<any>();
  userSearchKey: string = '';
  userFilterOption: string = '';

  tableChosen: string = 'program';

  programDisplayedColumns: string[] = ['position', 'programTitle', 'createdBy', 'date', 'time', 'description', 'telNo', 'datePublished', 'actions'];
  programDataSource = new MatTableDataSource<any>();

  businessDisplayedColumns: string[] = ['position', 'businessTitle', 'createdBy', 'description', 'datePublished', 'actions'];
  businessDataSource = new MatTableDataSource<any>();

  surveyDisplayedColumns: string[] = ['position', 'surveyTitle', 'createdBy', 'description', 'time', 'datePublished', 'actions'];
  surveyDataSource = new MatTableDataSource<any>();

  postSearchKey: string = '';

  @ViewChild(MatPaginator) clubPaginator!: MatPaginator;
  @ViewChild('clubTable') clubTable!: ElementRef;


  ngAfterViewInit() {
    this.clubDataSource.paginator = this.clubPaginator;
  }

  constructor(
    private userService: UserService,
    private programService: ProgramService,
    private businessService: BusinessService,
    private surveyService: SurveyService,
    private ngxService: NgxUiLoaderService,
    private snackbarService: SnackbarService,
    private dialog: MatDialog
  ) { }

  ngOnInit(){
    this.ngxService.start();
    this.getClubRequest();
    this.getAllUser();  
    this.getAllProgram();
    this.getAllBusiness();
    this.getAllSurvey();
  }

  filterUserByRole(role: string) {
    // console.log(role);
    this.userFilterOption = role;
  }

  getClubRequest() {
    this.userService.getClubRequest().subscribe((result: any[]) => {
      this.clubDataSource.data = result.map((item, index) => ({ ...item, position: index + 1 }));
      // console.log("Club request: ", this.clubDataSource.data);
    },
      (error: any) => {
        this.ngxService.stop();
        console.error(error);
      }
    );
  }

  approveClubRequest(userId: number) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.data = {
      message: 'approve this club'
    };
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, dialogConfig);
    const response = dialogRef.componentInstance.onEmitStatusChange.subscribe((response: any) => {
      dialogRef.close();
      this.userService.approveClubRequest(userId).subscribe((result: any) => {
          this.snackbarService.openSnackBar(result.message);
          this.clubDataSource.data = this.clubDataSource.data.filter(user => user.userId !== userId);
          this.getAllUser();
        },
        (error: any) => {
          console.error(error);
          this.snackbarService.openSnackBar("An error occurred while deleting the user.");
        });
    });

    dialogRef.afterClosed().subscribe(() => {
      response.unsubscribe();
    });
  }

  getAllUser() {
    this.userService.getAllUser().subscribe((result: any[]) => {
      this.ngxService.stop();
        // console.log(result);
        this.userDataSource.data = result.map((item, index) => ({ ...item, position: index + 1 }));
        console.log(this.userDataSource.data);
      },
      (error: any) => {
        this.ngxService.stop();
        console.error(error);
      }
    );
  }

  deleteUser(id: any, image: string) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.data = {
      message: 'delete this user'
    };

    let relativeImagePath = '';
    if(image != null){
      const imagePathParts = image.split(/[\\/]/);
      relativeImagePath = imagePathParts[imagePathParts.length - 1];
    } else {
      relativeImagePath = 'null';
    }

    const dialogRef = this.dialog.open(ConfirmationDialogComponent, dialogConfig);
    const response = dialogRef.componentInstance.onEmitStatusChange.subscribe((response: any) => {
      dialogRef.close();
        this.userService.deleteUser(id, relativeImagePath).subscribe((result: any) => {
          this.snackbarService.openSnackBar(result.message);
          this.userDataSource.data = this.userDataSource.data.filter(user => user.userId !== id);
          this.clubDataSource.data = this.clubDataSource.data.filter(user => user.userId !== id);
          return result;
        },
        (error: any) => {
          console.error(error);
          this.snackbarService.openSnackBar("An error occurred while deleting the user.");
        });
    });

    dialogRef.afterClosed().subscribe(() => {
      response.unsubscribe();
    });
  }

  tableToDisplay(table: string){
    this.tableChosen = table;
  }

  getAllProgram() { 
    this.programService.getAllProgram().subscribe((result: any[]) => {
      this.programDataSource.data = result.map((item, index) => ({ ...item, position: index + 1 }));
      // console.log(this.programDataSource.data);
    },
      (error: any) => {
        this.ngxService.stop();
        console.error(error);
      }
    );
  }

  deleteProgram(id: number, image: string) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.data = {
      message: 'delete this program'
    };

    const imagePathParts = image.split(/[\\/]/);
    const relativeImagePath = imagePathParts[imagePathParts.length - 1];

    const dialogRef = this.dialog.open(ConfirmationDialogComponent, dialogConfig);
    const response = dialogRef.componentInstance.onEmitStatusChange.subscribe((response: any) => {
      dialogRef.close();
        this.programService.deleteProgram(id, relativeImagePath).subscribe((result: any) => {
          this.snackbarService.openSnackBar(result.message);
          this.programDataSource.data = this.programDataSource.data.filter(program => program.programId !== id);
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

  getAllBusiness() {
    this.businessService.getAllBusiness().subscribe((result: any[]) => {
      this.businessDataSource.data = result.map((item, index) => ({ ...item, position: index + 1 }));
      // console.log(this.businessDataSource.data);
    },
      (error: any) => {
        this.ngxService.stop();
        console.error(error);
      }
    );
  }

  deleteBusiness(id: number, image: string) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.data = {
      message: 'delete this business'
    };

    const imagePathParts = image.split(/[\\/]/);
    const relativeImagePath = imagePathParts[imagePathParts.length - 1];

    const dialogRef = this.dialog.open(ConfirmationDialogComponent, dialogConfig);
    const response = dialogRef.componentInstance.onEmitStatusChange.subscribe((response: any) => {
      dialogRef.close();
        this.businessService.deleteBusiness(id, relativeImagePath).subscribe((result: any) => {
          this.snackbarService.openSnackBar(result.message);
          this.businessDataSource.data = this.businessDataSource.data.filter(business => business.businessId !== id);
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

  getAllSurvey() {
    this.surveyService.getAllSurvey().subscribe((result: any[]) => {
      this.surveyDataSource.data = result.map((item, index) => ({ ...item, position: index + 1 }));
      // console.log("Survey", this.surveyDataSource.data);
      this.ngxService.stop();
    },
      (error: any) => {
        this.ngxService.stop();
        console.error(error);
      }
    );
  }

  deleteSurvey(id: number) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.data = {
      message: 'delete this survey'
    };
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, dialogConfig);
    const response = dialogRef.componentInstance.onEmitStatusChange.subscribe((response: any) => {
      dialogRef.close();
        this.surveyService.deleteSurvey(id).subscribe((result: any) => {
          this.snackbarService.openSnackBar(result.message);
          this.surveyDataSource.data = this.surveyDataSource.data.filter(survey => survey.surveyId !== id);
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

