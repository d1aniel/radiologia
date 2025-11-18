import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, BehaviorSubject, map } from 'rxjs';

import { InformeI } from '../models/reports'; 
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

  
  getAllReports(): Observable<InformeI[]> {
    return this.http
      .get<GetAllReportsResponse>(this.baseUrl, { headers: this.getHeaders() })
      .pipe(
        map(resp => resp.reports)
      );
  }

  
  getReportById(id: number | string): Observable<InformeI> {
    return this.http
      .get<GetReportByIdResponse>(`${this.baseUrl}/${id}`, { headers: this.getHeaders() })
      .pipe(
        map(resp => resp.report)
      );
  }

  
  createReport(report: Omit<InformeI, 'id' | 'fechaCreacion'>): Observable<InformeI> {
    return this.http.post<InformeI>(this.baseUrl, report, {
      headers: this.getHeaders()
    });
  }

  
  updateReport(id: number | string, report: Partial<InformeI>): Observable<InformeI> {
    return this.http.patch<InformeI>(`${this.baseUrl}/${id}`, report, {
      headers: this.getHeaders()
    });
  }

  
  signReport(id: number | string) {
  return this.http.put(
    `${this.baseUrl}/${id}/sign`,
    {},
    { headers: this.getHeaders() }
  );
}


  
  deleteReport(id: number | string): Observable<{ message: string }> {
    return this.http.delete<{ message: string }>(
      `${this.baseUrl}/${id}`,
      { headers: this.getHeaders() }
    );
  }

  
  deleteReportAdv(id: number | string): Observable<{ message: string }> {
    return this.http.delete<{ message: string }>(
      `${this.baseUrl}/${id}/logic`,
      { headers: this.getHeaders() }
    );
  }

  
  updateLocalReports(reports: InformeI[]): void {
    this.reportsSubject.next(reports);
  }

  
  refreshReports(): void {
    this.getAllReports().subscribe(reports => {
      this.reportsSubject.next(reports);
    });
  }
}
