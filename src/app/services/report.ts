import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, BehaviorSubject, map } from 'rxjs';

import { InformeI } from '../models/reports'; // ajusta la ruta si tu archivo se llama distinto
import { AuthService } from '../services/auth';

interface GetAllReportsResponse {
  reports: InformeI[];
}

interface GetReportByIdResponse {
  report: InformeI;
}

@Injectable({
  providedIn: 'root'
})
export class ReportService {
  private baseUrl = 'http://localhost:4000/api/informes'; 
  private reportsSubject = new BehaviorSubject<InformeI[]>([]);
  public reports$ = this.reportsSubject.asObservable();

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

  // GET /informes  → backend: res.json({ reports })
  getAllReports(): Observable<InformeI[]> {
    return this.http
      .get<GetAllReportsResponse>(this.baseUrl, { headers: this.getHeaders() })
      .pipe(
        map(resp => resp.reports)
      );
  }

  // GET /informes/:id → backend: res.json({ report })
  getReportById(id: number | string): Observable<InformeI> {
    return this.http
      .get<GetReportByIdResponse>(`${this.baseUrl}/${id}`, { headers: this.getHeaders() })
      .pipe(
        map(resp => resp.report)
      );
  }

  // POST /informes → backend: res.status(201).json(newReport);
  createReport(report: Omit<InformeI, 'id' | 'fechaCreacion'>): Observable<InformeI> {
    return this.http.post<InformeI>(this.baseUrl, report, {
      headers: this.getHeaders()
    });
  }

  // PATCH /informes/:id → backend: res.status(200).json(report);
  updateReport(id: number | string, report: Partial<InformeI>): Observable<InformeI> {
    return this.http.patch<InformeI>(`${this.baseUrl}/${id}`, report, {
      headers: this.getHeaders()
    });
  }

  // PATCH /informes/:id/firmar → backend: res.json({ message, report })
  signReport(id: number | string) {
  return this.http.put(
    `${this.baseUrl}/${id}/sign`,
    {},
    { headers: this.getHeaders() }
  );
}


  // DELETE físico /informes/:id → backend: { message: "Report deleted successfully" }
  deleteReport(id: number | string): Observable<{ message: string }> {
    return this.http.delete<{ message: string }>(
      `${this.baseUrl}/${id}`,
      { headers: this.getHeaders() }
    );
  }

  // (Opcional) DELETE "lógico" /informes/:id/logic → backend: { message: "Report marked as borrador" }
  deleteReportAdv(id: number | string): Observable<{ message: string }> {
    return this.http.delete<{ message: string }>(
      `${this.baseUrl}/${id}/logic`,
      { headers: this.getHeaders() }
    );
  }

  // Estado local (igual que en PatientService)
  updateLocalReports(reports: InformeI[]): void {
    this.reportsSubject.next(reports);
  }

  // Refrescar desde backend y actualizar BehaviorSubject
  refreshReports(): void {
    this.getAllReports().subscribe(reports => {
      this.reportsSubject.next(reports);
    });
  }
}
