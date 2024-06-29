import { Injectable } from '@angular/core';
import { Router, CanActivate } from '@angular/router';
import { SnackbarService } from '../services/snackbar.service';
import { JwtDecoderService } from '../services/jwt-decoder.service';

@Injectable({
  providedIn: 'root'
})
export class RouterGuardService implements CanActivate {

  constructor(
    private router: Router,
    private snackbarService: SnackbarService,
    private jwtDecode: JwtDecoderService
  ) { }

  canActivate(): boolean {
    const token = localStorage.getItem('token');
    if (!token) {
      this.router.navigate(['/login']);
      this.snackbarService.openSnackBar('Please login to access this page');
      return false;
    }

    const decodedToken = this.jwtDecode.decodeToken(token);
    if (!decodedToken || this.jwtDecode.isTokenExpired(token)) {
      localStorage.removeItem('token');
      this.router.navigate(['/login']);
      this.snackbarService.openSnackBar('Session expired. Please login again.');
      return false;
    }
    
    return true;
  }
}
