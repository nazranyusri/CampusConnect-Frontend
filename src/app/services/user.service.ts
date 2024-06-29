import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable, catchError, tap, throwError } from 'rxjs';
import { environment } from '../../environments/environment';
import { JwtDecoderService } from './jwt-decoder.service';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiUrl = `${environment.apiUrl}/user`;
  // private headers = new HttpHeaders().set('Authorization', `Bearer ${localStorage.getItem('token')}`);
  private loggedIn: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  private authorized: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  
  get isLoggedIn() {
    return this.loggedIn.asObservable();
  }

  get isAuthorized() {
    return this.authorized.asObservable();
  }
  
  constructor(
    private http: HttpClient,
    private jwtDecode: JwtDecoderService
  ) { }

  authenticate(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/login`, data).pipe(
      tap((response: any) => {
        this.loggedIn.next(true) // Set to true on successful login
        const token = response.token;
        localStorage.setItem('token', token);
        if (token) {
          const decodedToken = this.jwtDecode.decodeToken(token);
          if (decodedToken && decodedToken.role === 'admin') {
            this.authorized.next(true);
          }
        }
      }),
      catchError(error => {
        this.loggedIn.next(false);
        this.authorized.next(false);
        return throwError(error);
      })
    );
  }

  registerUser(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/registeruser`, data);
  }

  registerClub(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/registerclub`, data);
  }

  getAllUser() {
    return this.http.get<any[]>(this.apiUrl);
  }

  getClubRequest() {
    return this.http.get<any[]>(`${this.apiUrl}/clubrequest`);
  }

  approveClubRequest(userId: number) {
    return this.http.patch(`${this.apiUrl}/approveclub`, {userId});
  }

  getUser(userId: number) {
    return this.http.get(`${this.apiUrl}/profile/${userId}`);
  }

  updateProfile(data: any): Observable<any> {
    return this.http.patch(`${this.apiUrl}/update`, data);
  }

  deleteUser(userId: number, imagePath: string) {
    // imagePath = imagePath || 'null';
    return this.http.delete(`${this.apiUrl}/delete/${userId}/${imagePath}`);
  }
}
