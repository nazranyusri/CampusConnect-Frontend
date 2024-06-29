import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PersakaService {
  private apiUrl = `${environment.apiUrl}/persaka`;
  // private headers = new HttpHeaders().set('Authorization', `Bearer ${localStorage.getItem('token')}`);
  constructor(private http: HttpClient) {}

  getPersakaContent(){
    return this.http.get(this.apiUrl);
  }

  updatePersaka(data: any){
    return this.http.patch(`${this.apiUrl}/update`, data);
  }
}
