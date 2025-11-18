
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { map } from 'rxjs/operators';
import { LabelsI } from '../models/labels'; 
import { AuthService } from '../services/auth';

@Injectable({
  providedIn: 'root'
})
export class LabelService {
  
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

  
  getAllLabels(): Observable<LabelsI[]> {
    return this.http.get<{ labels: LabelsI[] }>(this.baseUrl, {
      headers: this.getHeaders()
    }).pipe(
      map(res => res.labels) 
    );
  }

  
  getLabelById(id: number | string): Observable<LabelsI> {
    return this.http.get<{ label: LabelsI }>(`${this.baseUrl}/${id}`, {
      headers: this.getHeaders()
    }).pipe(
      map(res => res.label) 
    );
  }

  
  createLabel(label: Omit<LabelsI, 'id'>): Observable<LabelsI> {
    return this.http.post<LabelsI>(this.baseUrl, label, {
      headers: this.getHeaders()
    });
  }

  
  updateLabel(id: number | string, label: Partial<LabelsI>): Observable<LabelsI> {
    return this.http.patch<LabelsI>(`${this.baseUrl}/${id}`, label, {
      headers: this.getHeaders()
    });
  }

  
  deleteLabel(id: number | string): Observable<{ message: string }> {
    return this.http.delete<{ message: string }>(`${this.baseUrl}/${id}`, {
      headers: this.getHeaders()
    });
  }

  
  deleteLabelAdv(id: number | string): Observable<{ message: string }> {
    return this.http.delete<{ message: string }>(`${this.baseUrl}/${id}/logic`, {
      headers: this.getHeaders()
    });
  }

  

  updateLocalLabels(labels: LabelsI[]): void {
    this.labelsSubject.next(labels);
  }

  refreshLabels(): void {
    this.getAllLabels().subscribe(labels => {
      this.labelsSubject.next(labels);
    });
  }
}
