// src/app/services/modalidad.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { map } from 'rxjs/operators';

import { AuthService } from '../services/auth';
import { ModalidadI } from '../models/modalities'; // ajusta la ruta/nombre según tu proyecto

@Injectable({
  providedIn: 'root'
})
export class ModalidadService {
  private baseUrl = 'http://localhost:4000/api/modalidades';

  private modalidadesSubject = new BehaviorSubject<ModalidadI[]>([]);
  public modalidades$ = this.modalidadesSubject.asObservable();

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

  // GET /api/modalidades  → { modalidades: ModalidadI[] }
  getAllModalidades(): Observable<ModalidadI[]> {
    return this.http
      .get<{ modalidades: ModalidadI[] }>(this.baseUrl, { headers: this.getHeaders() })
      .pipe(
        map(resp => resp.modalidades ?? [])
      );
  }

  // GET /api/modalidades/:id → { modalidad: ModalidadI }
  getModalidadById(id: number | string): Observable<ModalidadI> {
    return this.http
      .get<{ modalidad: ModalidadI }>(`${this.baseUrl}/${id}`, { headers: this.getHeaders() })
      .pipe(
        map(resp => resp.modalidad)
      );
  }

  // POST /api/modalidades → { modalidad: ModalidadI }
  createModalidad(data: Omit<ModalidadI, 'id'>): Observable<ModalidadI> {
    return this.http
      .post<{ modalidad: ModalidadI }>(this.baseUrl, data, { headers: this.getHeaders() })
      .pipe(
        map(resp => resp.modalidad)
      );
  }

  // PATCH /api/modalidades/:id → { modalidad: ModalidadI }
  updateModalidad(id: number | string, data: Partial<ModalidadI>): Observable<ModalidadI> {
    return this.http
      .patch<{ modalidad: ModalidadI }>(`${this.baseUrl}/${id}`, data, { headers: this.getHeaders() })
      .pipe(
        map(resp => resp.modalidad)
      );
  }

  // DELETE /api/modalidades/:id → { message: string }
  deleteModalidad(id: number | string): Observable<{ message: string }> {
    return this.http.delete<{ message: string }>(
      `${this.baseUrl}/${id}`,
      { headers: this.getHeaders() }
    );
  }

  // DELETE lógico /api/modalidades/:id/logic → { message: string }
  deleteModalidadAdv(id: number | string): Observable<{ message: string }> {
    return this.http.delete<{ message: string }>(
      `${this.baseUrl}/${id}/logic`,
      { headers: this.getHeaders() }
    );
  }

  // ==== Manejo de estado local (igual que pacientes) ====

  updateLocalModalidades(modalidades: ModalidadI[]): void {
    this.modalidadesSubject.next(modalidades);
  }

  refreshModalidades(): void {
    this.getAllModalidades().subscribe(modalidades => {
      this.modalidadesSubject.next(modalidades);
    });
  }
}
