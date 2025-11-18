// src/app/services/patient.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { PacientsI } from '../models/pacients'; // ajusta la ruta/nombre si tu archivo difiere
import { AuthService } from '../services/auth';

@Injectable({
  providedIn: 'root'
})
export class PatientService {
  private baseUrl = 'http://localhost:4000/api/pacientes';
  private patientsSubject = new BehaviorSubject<PacientsI[]>([]);
  public patients$ = this.patientsSubject.asObservable();

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

  // GET /patients (solo activos según tu backend)
  getAllPatients(): Observable<PacientsI[]> {
    return this.http.get<PacientsI[]>(this.baseUrl, { headers: this.getHeaders() });
  }

  // GET /patients/:id
  getPatientById(id: number | string): Observable<PacientsI> {
    return this.http.get<PacientsI>(`${this.baseUrl}/${id}`, { headers: this.getHeaders() });
  }

  // POST /patients
  createPatient(patient: PacientsI): Observable<PacientsI> {
    return this.http.post<PacientsI>(this.baseUrl, patient, { headers: this.getHeaders() });
  }

  // PATCH /patients/:id  (coincide con tu controlador updatePatient)
  updatePatient(id: number | string, patient: Partial<PacientsI>): Observable<PacientsI> {
    return this.http.patch<PacientsI>(`${this.baseUrl}/${id}`, patient, { headers: this.getHeaders() });
  }

  // DELETE físico /patients/:id
  deletePatient(id: number | string): Observable<{ message: string }> {
    return this.http.delete<{ message: string }>(`${this.baseUrl}/${id}`, { headers: this.getHeaders() });
  }

  // DELETE lógico /patients/:id/logic  (coincide con deletePatientAdv)
  deletePatientAdv(id: number | string): Observable<{ message: string }> {
    return this.http.delete<{ message: string }>(`${this.baseUrl}/${id}/logic`, { headers: this.getHeaders() });
  }

  // Estado local
  updateLocalPatients(patients: PacientsI[]): void {
    this.patientsSubject.next(patients);
  }

  // Refrescar desde backend y actualizar el BehaviorSubject
  refreshPatients(): void {
    this.getAllPatients().subscribe(patients => {
      this.patientsSubject.next(patients);
    });
  }
}
