import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class BusinessService {
  private apiUrl = `${environment.apiUrl}/business`;
  // private headers = new HttpHeaders().set('Authorization', `Bearer ${localStorage.getItem('token')}`);
  constructor(private http: HttpClient) {}

  getAllBusiness(){
    return this.http.get<any[]>(this.apiUrl);
  }

  getBusinessById(businessId: number){
    return this.http.get(`${this.apiUrl}/${businessId}`);
  }

  getTotalBusiness(){
    return this.http.get(`${this.apiUrl}/total`);
  }

  getLatestBusiness(){
    return this.http.get(`${this.apiUrl}/latest`);
  }

  getMenuItems(businessId: number){
    return this.http.get(`${this.apiUrl}/menu/${businessId}`);
  }

  checkout(data: any) {
    return this.http.post(`${this.apiUrl}/checkout`, data)
  }

  addBusiness(data: any){
    return this.http.post(`${this.apiUrl}/add`, data);
  }

  updateBusiness(data: any){
    return this.http.patch(`${this.apiUrl}/update`, data);
  }

  deleteBusiness(id: number, imagePath: string){
    return this.http.delete(`${this.apiUrl}/delete/${id}/${imagePath}`);
  }

  deleteMenuItem(menuId: number) {
    return this.http.delete(`${this.apiUrl}/menu/delete/${menuId}`);
  }
  
  getBusinessHistory(userId: number){
    return this.http.get(`${this.apiUrl}/history/${userId}`);
  }

  getUserOrderedBusiness(userId: number){
    return this.http.get(`${this.apiUrl}/ordered/${userId}`);
  }

  getBusinessOrderList(businessId: number): Observable<any[]>{
    return this.http.get<any[]>(`${this.apiUrl}/orderList/${businessId}`);
  }

  updateOrderStatus(orderId: number, status: string) {
    return this.http.patch(`${this.apiUrl}/update/${orderId}`, {status})
  }
}
