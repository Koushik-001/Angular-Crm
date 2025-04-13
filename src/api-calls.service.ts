import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../environment';


@Injectable({
    providedIn: 'root',
  })
export class AuthService {
  constructor(private http: HttpClient) {}
  generateOtp(phone: string) {
    const body = {phone};
    const data = this.http.post(`${environment.BASE_URL}/login`,body);
    return data;
  }
  verifyOtp(details:{ phone: string, otp: string }){
    const body = {phone:details?.phone,otp:details?.otp}
    const data = this.http.put<any>(`${environment.BASE_URL}/verify-otp`,body)
    return data;
  }
  getMetrics(phone:string){
    const data = this.http.get<any>(`${environment.BASE_URL}/user_metric/${phone}`)
    return data;
  }
  getUserFeedback(phone:string){
    console.log(phone,'phone in feedback')
    const data = this.http.get<any>(`${environment.BASE_URL}/find_feedback/${phone}`)
    return data;
  }
}