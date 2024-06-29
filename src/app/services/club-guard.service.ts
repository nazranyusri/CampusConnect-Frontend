import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { SnackbarService } from './snackbar.service';
import { JwtDecoderService } from './jwt-decoder.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ClubGuardService implements CanActivate {

  constructor(
    private router: Router,
    private snackbarService: SnackbarService,
    private jwtDecode: JwtDecoderService
  ) { }

  canActivate(): boolean {
    const token = localStorage.getItem('token');
    if (token) {
      const decodedToken = this.jwtDecode.decodeToken(token);
      if (decodedToken) {
        if (decodedToken.role !== 'club') {
          this.router.navigate(['/']);
          this.snackbarService.openSnackBar('You are not authorized to access this page');
          return false;
        }
      }
    }
    return true;
  }
}
