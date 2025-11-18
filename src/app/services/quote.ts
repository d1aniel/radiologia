
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable, map } from 'rxjs';
import { CitaI } from '../models/quotes';
import { AuthService } from '../services/auth';

@Injectable({
  providedIn: 'root',
})
export class QuoteService {
  
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

  
  getAllQuotes(): Observable<CitaI[]> {
    return this.http
      .get<{ quotes: CitaI[] }>(this.baseUrl, { headers: this.getHeaders() })
      .pipe(map((resp) => resp.quotes));
  }

  
  getQuoteById(id: number | string): Observable<CitaI> {
    return this.http
      .get<{ quote: CitaI }>(`${this.baseUrl}/${id}`, {
        headers: this.getHeaders(),
      })
      .pipe(map((resp) => resp.quote));
  }

  
  
  createQuote(cita: Omit<CitaI, 'id'>): Observable<CitaI> {
    return this.http.post<CitaI>(this.baseUrl, cita, {
      headers: this.getHeaders(),
    });
  }

  
  updateQuote(
    id: number | string,
    cita: Partial<CitaI>
  ): Observable<CitaI> {
    return this.http.patch<CitaI>(`${this.baseUrl}/${id}`, cita, {
      headers: this.getHeaders(),
    });
  }

  
  deleteQuote(id: number | string): Observable<{ message: string }> {
    return this.http.delete<{ message: string }>(`${this.baseUrl}/${id}`, {
      headers: this.getHeaders(),
    });
  }

  
  deleteQuoteAdv(id: number | string): Observable<{ message: string }> {
    return this.http.delete<{ message: string }>(
      `${this.baseUrl}/${id}/logic`,
      {
        headers: this.getHeaders(),
      }
    );
  }

  
  updateLocalQuotes(quotes: CitaI[]): void {
    this.quotesSubject.next(quotes);
  }

  
  refreshQuotes(): void {
    this.getAllQuotes().subscribe((quotes) => {
      this.quotesSubject.next(quotes);
    });
  }
}
