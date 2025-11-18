
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { PaymentI } from '../models/payments';   
import { AuthService } from '../services/auth';

@Injectable({
  providedIn: 'root'
})
export class PaymentService {
 
  private baseUrl = 'http://localhost:4000/api/pagos';

  private paymentsSubject = new BehaviorSubject<PaymentI[]>([]);
  public payments$ = this.paymentsSubject.asObservable();

  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) {}

  
  private getHeaders(): HttpHeaders {
    let headers = new HttpHeaders();
    const token = this.authService.getToken();
    if (token) {
      headers = headers.set('Authorization', `Bearer ${token}`);
    }
    return headers;
  }

  

  
  getAllPayments(): Observable<PaymentI[]> {
    return this.http
      .get<{ payments: PaymentI[] }>(this.baseUrl, { headers: this.getHeaders() })
      .pipe(
        map(resp => resp.payments)
      );
  }

  
  getPaymentById(id: number | string): Observable<PaymentI> {
    return this.http
      .get<{ payment: PaymentI }>(`${this.baseUrl}/${id}`, { headers: this.getHeaders() })
      .pipe(
        map(resp => resp.payment)
      );
  }

  
  createPayment(payment: Omit<PaymentI, 'id'>): Observable<PaymentI> {
    return this.http.post<PaymentI>(this.baseUrl, payment, {
      headers: this.getHeaders()
    });
  }

  
  updatePayment(id: number | string, payment: Partial<PaymentI>): Observable<PaymentI> {
    return this.http.patch<PaymentI>(`${this.baseUrl}/${id}`, payment, {
      headers: this.getHeaders()
    });
  }

  
  deletePayment(id: number | string): Observable<{ message: string }> {
    return this.http.delete<{ message: string }>(`${this.baseUrl}/${id}`, {
      headers: this.getHeaders()
    });
  }

  
  deletePaymentAdv(id: number | string): Observable<{ message: string }> {
    return this.http.delete<{ message: string }>(`${this.baseUrl}/${id}/logic`, {
      headers: this.getHeaders()
    });
  }

  

  updateLocalPayments(payments: PaymentI[]): void {
    this.paymentsSubject.next(payments);
  }

  refreshPayments(): void {
    this.getAllPayments().subscribe(payments => {
      this.paymentsSubject.next(payments);
    });
  }
}
