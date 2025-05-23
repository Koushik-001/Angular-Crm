import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../environment';
import { CookieService } from 'ngx-cookie-service';
import { tap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(private http: HttpClient, private cookieService: CookieService) {}

  generateOtp(phone: string) {
    const body = { phone };
    return this.http.post(`${environment.BASE_URL}/login`, body);
  }

  verifyOtp(details: { phone: string, otp: string }) {
    const body = { phone: details?.phone, otp: details?.otp };
    return this.http.put<any>(`${environment.BASE_URL}/verify-otp`, body).pipe(
      tap(response => {
        if (response.token) {
          this.cookieService.set('auth_token', response.token, 7, '/');
        }
      })
    );
  }

  getMetrics(phone: string) {
    const token = this.cookieService.get('auth_token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.get<any>(`${environment.BASE_URL}/user_metric/${phone}`, { headers });
  }

  getUserFeedback(phone: string) {
    const token = this.cookieService.get('auth_token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.get<any>(`${environment.BASE_URL}/find_feedback/${phone}`, { headers });
  }

  submitUserFeedback(formData: { [key: string]: string | null }) {
    const token = this.cookieService.get('auth_token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.post<any>(`${environment.BASE_URL}/user_feedback`, formData, { headers });
  }
   
  randomForestApi() {
  const tokenValue = this.cookieService.get('auth_token');
  const body = {
    token: tokenValue  
  };

  return this.http.post<any>('http://127.0.0.1:8000/predict', body);
}
 
  modelTrainingApi(){
    const phone = localStorage.getItem('phone')
    const token = this.cookieService.get('auth_token');
    return this.http.get<any>(`http://127.0.0.1:8000/train/${phone}/${token}`);
  }
}
