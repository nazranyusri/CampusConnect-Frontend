import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Registrant } from '../interface/registrant';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProgramService {
  private apiUrl = `${environment.apiUrl}/program`;
  // private headers = new HttpHeaders().set('Authorization', `Bearer ${localStorage.getItem('token')}`);
  constructor(private http: HttpClient) {}

  getAllProgram(){
    return this.http.get<any[]>(this.apiUrl);
  }

  getProgramById(id: number){
    return this.http.get(`${this.apiUrl}/${id}`);
  }

  getTotalProgram(){
    return this.http.get(`${this.apiUrl}/total`);
  }

  getLatestProgram(){
    return this.http.get(`${this.apiUrl}/latest`);
  }

  addProgram(data: any){
    // console.log("addProgram called");
    return this.http.post(`${this.apiUrl}/add`, data);
  }

  updateProgram(data: any){
    return this.http.patch(`${this.apiUrl}/update`, data);
  }

  deleteProgram(id: number, imagePath: string){
    // console.log("deleteProgram imagePath:", imagePath);
    return this.http.delete(`${this.apiUrl}/delete/${id}/${imagePath}`);
  }

  registerProgram(data: any) {
    // console.log("registerProgram called");
    return this.http.post(`${this.apiUrl}/register`, data);
  }

  getRegistrantList(programId: number): Observable<Registrant[]> {
    return this.http.get<Registrant[]>(`${this.apiUrl}/registrant/${programId}`,);
  }

  getProgramHistory(userId: number){
    return this.http.get(`${this.apiUrl}/history/${userId}`);
  }

  getUserRegisteredPrograms(userId: number){
    return this.http.get(`${this.apiUrl}/registered/${userId}`);
  }
}
