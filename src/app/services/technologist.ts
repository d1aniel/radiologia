
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { map } from 'rxjs/operators';

import { TecnologoI } from '../models/technologists'; 
import { AuthService } from '../services/auth';

@Injectable({
  providedIn: 'root'
})
export class TechnologistService {
  private baseUrl = 'http://localhost:4000/api/tecnologos'; 
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

  
  getAllTechnologists(): Observable<TecnologoI[]> {
    return this.http
      .get<{ technologists: TecnologoI[] }>(this.baseUrl, {
        headers: this.getHeaders()
      })
      .pipe(map(resp => resp.technologists));
  }

  
  getTechnologistById(id: number | string): Observable<TecnologoI> {
    return this.http
      .get<{ technologist: TecnologoI }>(`${this.baseUrl}/${id}`, {
        headers: this.getHeaders()
      })
      .pipe(map(resp => resp.technologist));
  }

  
  createTechnologist(technologist: TecnologoI): Observable<TecnologoI> {
    return this.http.post<TecnologoI>(this.baseUrl, technologist, {
      headers: this.getHeaders()
    });
  }

  
  updateTechnologist(
    id: number | string,
    technologist: Partial<TecnologoI>
  ): Observable<TecnologoI> {
    return this.http.patch<TecnologoI>(`${this.baseUrl}/${id}`, technologist, {
      headers: this.getHeaders()
    });
  }

  
  deleteTechnologist(id: number | string): Observable<{ message: string }> {
    return this.http.delete<{ message: string }>(`${this.baseUrl}/${id}`, {
      headers: this.getHeaders()
    });
  }

  
  deleteTechnologistAdv(id: number | string): Observable<{ message: string }> {
    return this.http.delete<{ message: string }>(
      `${this.baseUrl}/${id}/logic`,
      {
        headers: this.getHeaders()
      }
    );
  }

  
  updateLocalTechnologists(technologists: TecnologoI[]): void {
    this.technologistsSubject.next(technologists);
  }

  
  refreshTechnologists(): void {
    this.getAllTechnologists().subscribe(technologists => {
      this.technologistsSubject.next(technologists);
    });
  }
}
