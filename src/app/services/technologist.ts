// src/app/services/technologist.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { map } from 'rxjs/operators';

import { TecnologoI } from '../models/technologists'; // ajusta ruta/nombre si difiere
import { AuthService } from '../services/auth';

@Injectable({
  providedIn: 'root'
})
export class TechnologistService {
  private baseUrl = 'http://localhost:4000/api/tecnologos'; // 👈 ajusta si tu endpoint es otro
  private technologistsSubject = new BehaviorSubject<TecnologoI[]>([]);
  public technologists$ = this.technologistsSubject.asObservable();

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

  // GET /technologists  -> { technologists: [...] }
  getAllTechnologists(): Observable<TecnologoI[]> {
    return this.http
      .get<{ technologists: TecnologoI[] }>(this.baseUrl, {
        headers: this.getHeaders()
      })
      .pipe(map(resp => resp.technologists));
  }

  // GET /technologists/:id  -> { technologist: {...} }
  getTechnologistById(id: number | string): Observable<TecnologoI> {
    return this.http
      .get<{ technologist: TecnologoI }>(`${this.baseUrl}/${id}`, {
        headers: this.getHeaders()
      })
      .pipe(map(resp => resp.technologist));
  }

  // POST /technologists  -> devuelve el objeto creado
  createTechnologist(technologist: TecnologoI): Observable<TecnologoI> {
    return this.http.post<TecnologoI>(this.baseUrl, technologist, {
      headers: this.getHeaders()
    });
  }

  // PATCH /technologists/:id  -> devuelve el objeto actualizado
  updateTechnologist(
    id: number | string,
    technologist: Partial<TecnologoI>
  ): Observable<TecnologoI> {
    return this.http.patch<TecnologoI>(`${this.baseUrl}/${id}`, technologist, {
      headers: this.getHeaders()
    });
  }

  // DELETE físico /technologists/:id
  deleteTechnologist(id: number | string): Observable<{ message: string }> {
    return this.http.delete<{ message: string }>(`${this.baseUrl}/${id}`, {
      headers: this.getHeaders()
    });
  }

  // DELETE lógico /technologists/:id/logic
  deleteTechnologistAdv(id: number | string): Observable<{ message: string }> {
    return this.http.delete<{ message: string }>(
      `${this.baseUrl}/${id}/logic`,
      {
        headers: this.getHeaders()
      }
    );
  }

  // Estado local
  updateLocalTechnologists(technologists: TecnologoI[]): void {
    this.technologistsSubject.next(technologists);
  }

  // Refrescar desde backend y actualizar el BehaviorSubject
  refreshTechnologists(): void {
    this.getAllTechnologists().subscribe(technologists => {
      this.technologistsSubject.next(technologists);
    });
  }
}
