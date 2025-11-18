// src/app/services/label.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { map } from 'rxjs/operators';
import { LabelsI } from '../models/labels'; // 👈 ajusta la ruta si tu archivo se llama distinto
import { AuthService } from '../services/auth';

@Injectable({
  providedIn: 'root'
})
export class LabelService {
  // 👇 coincide con tu backend
  private baseUrl = 'http://localhost:4000/api/etiquetas';

  private labelsSubject = new BehaviorSubject<LabelsI[]>([]);
  public labels$ = this.labelsSubject.asObservable();

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

  // GET /etiquetas  -> { labels: [...] }
  getAllLabels(): Observable<LabelsI[]> {
    return this.http.get<{ labels: LabelsI[] }>(this.baseUrl, {
      headers: this.getHeaders()
    }).pipe(
      map(res => res.labels) // 👈 devolvemos solo el array
    );
  }

  // GET /etiquetas/:id  -> { label: {...} }
  getLabelById(id: number | string): Observable<LabelsI> {
    return this.http.get<{ label: LabelsI }>(`${this.baseUrl}/${id}`, {
      headers: this.getHeaders()
    }).pipe(
      map(res => res.label) // 👈 devolvemos solo el objeto
    );
  }

  // POST /etiquetas
  createLabel(label: Omit<LabelsI, 'id'>): Observable<LabelsI> {
    return this.http.post<LabelsI>(this.baseUrl, label, {
      headers: this.getHeaders()
    });
  }

  // PATCH /etiquetas/:id
  updateLabel(id: number | string, label: Partial<LabelsI>): Observable<LabelsI> {
    return this.http.patch<LabelsI>(`${this.baseUrl}/${id}`, label, {
      headers: this.getHeaders()
    });
  }

  // DELETE físico /etiquetas/:id
  deleteLabel(id: number | string): Observable<{ message: string }> {
    return this.http.delete<{ message: string }>(`${this.baseUrl}/${id}`, {
      headers: this.getHeaders()
    });
  }

  // DELETE lógico /etiquetas/:id/logic
  deleteLabelAdv(id: number | string): Observable<{ message: string }> {
    return this.http.delete<{ message: string }>(`${this.baseUrl}/${id}/logic`, {
      headers: this.getHeaders()
    });
  }

  // ===== Estado local (opcional, igual que pacientes) =====

  updateLocalLabels(labels: LabelsI[]): void {
    this.labelsSubject.next(labels);
  }

  refreshLabels(): void {
    this.getAllLabels().subscribe(labels => {
      this.labelsSubject.next(labels);
    });
  }
}
