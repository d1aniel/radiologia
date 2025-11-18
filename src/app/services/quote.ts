// src/app/services/quote.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable, map } from 'rxjs';
import { CitaI } from '../models/quotes';
import { AuthService } from '../services/auth';

@Injectable({
  providedIn: 'root',
})
export class QuoteService {
  // 👇 ajusta la URL si tu endpoint es otro (ej: /api/citas)
  private baseUrl = 'http://localhost:4000/api/quotes';

  private quotesSubject = new BehaviorSubject<CitaI[]>([]);
  public quotes$ = this.quotesSubject.asObservable();

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

  // GET /quotes  -> { quotes: CitaI[] }
  getAllQuotes(): Observable<CitaI[]> {
    return this.http
      .get<{ quotes: CitaI[] }>(this.baseUrl, { headers: this.getHeaders() })
      .pipe(map((resp) => resp.quotes));
  }

  // GET /quotes/:id -> { quote: CitaI }
  getQuoteById(id: number | string): Observable<CitaI> {
    return this.http
      .get<{ quote: CitaI }>(`${this.baseUrl}/${id}`, {
        headers: this.getHeaders(),
      })
      .pipe(map((resp) => resp.quote));
  }

  // POST /quotes
  // el objeto debe traer: patient_id, technologist_id, modalidad, equipo, fechaHora, motivo, estado?
  createQuote(cita: Omit<CitaI, 'id'>): Observable<CitaI> {
    return this.http.post<CitaI>(this.baseUrl, cita, {
      headers: this.getHeaders(),
    });
  }

  // PATCH /quotes/:id
  updateQuote(
    id: number | string,
    cita: Partial<CitaI>
  ): Observable<CitaI> {
    return this.http.patch<CitaI>(`${this.baseUrl}/${id}`, cita, {
      headers: this.getHeaders(),
    });
  }

  // DELETE físico /quotes/:id
  deleteQuote(id: number | string): Observable<{ message: string }> {
    return this.http.delete<{ message: string }>(`${this.baseUrl}/${id}`, {
      headers: this.getHeaders(),
    });
  }

  // DELETE lógico /quotes/:id/logic (estado = CANCELADA)
  deleteQuoteAdv(id: number | string): Observable<{ message: string }> {
    return this.http.delete<{ message: string }>(
      `${this.baseUrl}/${id}/logic`,
      {
        headers: this.getHeaders(),
      }
    );
  }

  // Estado local
  updateLocalQuotes(quotes: CitaI[]): void {
    this.quotesSubject.next(quotes);
  }

  // Refrescar desde backend y actualizar BehaviorSubject
  refreshQuotes(): void {
    this.getAllQuotes().subscribe((quotes) => {
      this.quotesSubject.next(quotes);
    });
  }
}
