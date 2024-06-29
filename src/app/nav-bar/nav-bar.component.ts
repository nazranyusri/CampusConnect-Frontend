import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { ConfirmationDialogComponent } from '../confirmation-dialog/confirmation-dialog.component';
import { UserService } from '../services/user.service';
import { JwtDecoderService } from '../services/jwt-decoder.service';

@Component({
  selector: 'app-nav-bar',
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.scss']
})
export class NavBarComponent implements OnInit {
  isLoggedIn: boolean = false;
  isAuthorized: boolean = false;
  // username: string = '';

  constructor(
    private userService:UserService,
    private dialog: MatDialog, 
    private router: Router,
    private jwtDecode: JwtDecoderService
  ) {}

  ngOnInit() {
    this.userService.isLoggedIn.subscribe((response: any) => {
      this.isLoggedIn = response;
    });

    this.userService.isAuthorized.subscribe((response: any) => {
      this.isAuthorized = response;
    });

    const token = localStorage.getItem('token');
    if(token != null){
      this.isLoggedIn = true;
      const decodedToken = this.jwtDecode.decodeToken(token);
      if(decodedToken && decodedToken.role === 'admin'){
        // console.log(decodedToken.role);
        this.isAuthorized = true;
      }
    }
  }

  logout() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.data = {
      message: 'log out'
    };

    const dialogRef = this.dialog.open(ConfirmationDialogComponent, dialogConfig);
    const response = dialogRef.componentInstance.onEmitStatusChange.subscribe((response:any) => {
      dialogRef.close();
      localStorage.removeItem('token');
      this.router.navigate(['/']);
      this.isLoggedIn = false;
      this.isAuthorized = false;
    });
  }
}
