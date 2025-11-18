// src/app/services/medico.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { map } from 'rxjs/operators';
import { AuthService } from '../services/auth';
import { MedicoI } from '../models/doctors'; // ajusta la ruta/nombre

// Modelo tal como lo devuelve el backend (telefono como string)
interface DoctorBackendI {
  id: number;
  nombre: string;
  especialidad: string;
  telefono: string;
  correo: string;
  registro?: string | null;
  status: 'ACTIVATE' | 'INACTIVE';
}

@Injectable({
  providedIn: 'root'
})
export class MedicoService {
  // AJUSTA esta URL a tu ruta real
  private baseUrl = 'http://localhost:4000/api/doctores';

  private medicosSubject = new BehaviorSubject<MedicoI[]>([]);
  public medicos$ = this.medicosSubject.asObservable();

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

  // ==== Helpers de mapeo ====

  // Backend -> Front
  private mapBackendToFront(d: DoctorBackendI): MedicoI {
    return {
      ...d,
      telefono: d.telefono || '', // por si viene algo raro
      registro: d.registro || undefined, // convert null to undefined
    };
  }

  // Front -> Backend (para crear/actualizar)
  private mapFrontToBackend(m: MedicoI | Partial<MedicoI>): any {
    return {
      ...m,
      telefono: m.telefono !== undefined ? String(m.telefono) : undefined,
    };
  }

  // ==== CRUD ====

  // GET /doctores  -> { doctors: DoctorBackendI[] }
  getAllMedicos(): Observable<MedicoI[]> {
    return this.http
      .get<{ doctors: DoctorBackendI[] }>(this.baseUrl, { headers: this.getHeaders() })
      .pipe(
        map(resp => resp.doctors.map(d => this.mapBackendToFront(d)))
      );
  }

  // GET /doctores/:id  -> { doctor: DoctorBackendI }
  getMedicoById(id: number | string): Observable<MedicoI> {
    return this.http
      .get<{ doctor: DoctorBackendI }>(`${this.baseUrl}/${id}`, { headers: this.getHeaders() })
      .pipe(
        map(resp => this.mapBackendToFront(resp.doctor))
      );
  }

  // POST /doctores
  createMedico(medico: MedicoI): Observable<MedicoI> {
    const body = this.mapFrontToBackend(medico);
    return this.http
      .post<DoctorBackendI>(this.baseUrl, body, { headers: this.getHeaders() })
      .pipe(map(d => this.mapBackendToFront(d)));
  }

  // PATCH /doctores/:id
  updateMedico(id: number | string, medico: Partial<MedicoI>): Observable<MedicoI> {
    const body = this.mapFrontToBackend(medico);
    return this.http
      .patch<DoctorBackendI>(`${this.baseUrl}/${id}`, body, { headers: this.getHeaders() })
      .pipe(map(d => this.mapBackendToFront(d)));
  }

  // DELETE físico /doctores/:id
  deleteMedico(id: number | string): Observable<{ message: string }> {
    return this.http.delete<{ message: string }>(`${this.baseUrl}/${id}`, {
      headers: this.getHeaders(),
    });
  }

  // DELETE lógico /doctores/:id/logic
  deleteMedicoAdv(id: number | string): Observable<{ message: string }> {
    return this.http.delete<{ message: string }>(
      `${this.baseUrl}/${id}/logic`,
      { headers: this.getHeaders() }
    );
  }

  // ==== Estado local ====

  updateLocalMedicos(medicos: MedicoI[]): void {
    this.medicosSubject.next(medicos);
  }

  refreshMedicos(): void {
    this.getAllMedicos().subscribe(medicos => {
      this.medicosSubject.next(medicos);
    });
  }
}
