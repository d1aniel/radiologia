// src/app/services/payment.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { PaymentI } from '../models/payments';   // ajusta la ruta si es distinta
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

  // ===== Helpers =====
  private getHeaders(): HttpHeaders {
    let headers = new HttpHeaders();
    const token = this.authService.getToken();
    if (token) {
      headers = headers.set('Authorization', `Bearer ${token}`);
    }
    return headers;
  }

  // ===== CRUD =====

  // GET /payments   -> controlador devuelve { payments: [...] }
  getAllPayments(): Observable<PaymentI[]> {
    return this.http
      .get<{ payments: PaymentI[] }>(this.baseUrl, { headers: this.getHeaders() })
      .pipe(
        map(resp => resp.payments)
      );
  }

  // GET /payments/:id   -> controlador devuelve { payment: {...} }
  getPaymentById(id: number | string): Observable<PaymentI> {
    return this.http
      .get<{ payment: PaymentI }>(`${this.baseUrl}/${id}`, { headers: this.getHeaders() })
      .pipe(
        map(resp => resp.payment)
      );
  }

  // POST /payments   -> controlador responde con el payment creado (instancia directa)
  createPayment(payment: Omit<PaymentI, 'id'>): Observable<PaymentI> {
    return this.http.post<PaymentI>(this.baseUrl, payment, {
      headers: this.getHeaders()
    });
  }

  // PATCH /payments/:id   -> controlador responde con el payment actualizado (instancia directa)
  updatePayment(id: number | string, payment: Partial<PaymentI>): Observable<PaymentI> {
    return this.http.patch<PaymentI>(`${this.baseUrl}/${id}`, payment, {
      headers: this.getHeaders()
    });
  }

  // DELETE físico /payments/:id   -> { message: string }
  deletePayment(id: number | string): Observable<{ message: string }> {
    return this.http.delete<{ message: string }>(`${this.baseUrl}/${id}`, {
      headers: this.getHeaders()
    });
  }

  // DELETE lógico /payments/:id/logic   -> { message: string }
  deletePaymentAdv(id: number | string): Observable<{ message: string }> {
    return this.http.delete<{ message: string }>(`${this.baseUrl}/${id}/logic`, {
      headers: this.getHeaders()
    });
  }

  // ===== Estado local (igual que en PatientService) =====

  updateLocalPayments(payments: PaymentI[]): void {
    this.paymentsSubject.next(payments);
  }

  refreshPayments(): void {
    this.getAllPayments().subscribe(payments => {
      this.paymentsSubject.next(payments);
    });
  }
}
