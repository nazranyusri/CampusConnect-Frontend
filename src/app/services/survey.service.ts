import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SurveyService {
  private apiUrl = `${environment.apiUrl}/survey`;
  // private headers = new HttpHeaders().set('Authorization', `Bearer ${localStorage.getItem('token')}`);
  constructor(private http: HttpClient) {}

  getAllSurvey(){
    return this.http.get<any[]>(this.apiUrl);
  }

  getTotalSurvey(){
    return this.http.get(`${this.apiUrl}/total`);
  }

  getLatestSurvey(){
    return this.http.get(`${this.apiUrl}/latest`);
  }

  getSurveyById(surveyId: number){
    return this.http.get(`${this.apiUrl}/${surveyId}`);
  }

  addSurvey(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/add`, data);
  }

  updateSurvey(data: any): Observable<any> {
    // console.log("Service data:", data);
    return this.http.patch(`${this.apiUrl}/update`, data);
  }

  deleteSurvey(surveyId: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/delete/${surveyId}`);
  }

  getSurveyHistory(userId: number){
    return this.http.get(`${this.apiUrl}/history/${userId}`);
  }
}
