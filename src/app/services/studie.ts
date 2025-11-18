
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { AuthService } from './auth';

import {
  StudyCreateI,
  StudyReadI,
  GetAllStudiesResponse,
  GetStudyByIdResponse,
  DeleteStudyResponse,
} from '../models/studies';

@Injectable({ providedIn: 'root' })
export class StudyService {
  private baseUrl = 'http://localhost:4000/api/estudios';

  
  private studiesSubject = new BehaviorSubject<StudyReadI[]>([]);
  public studies$ = this.studiesSubject.asObservable();

  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) {}

  
  private getHeaders(): HttpHeaders {
    let headers = new HttpHeaders();
    const token = this.authService.getToken();
    if (token) headers = headers.set('Authorization', `Bearer ${token}`);
    return headers;
  }

  
  getAll(): Observable<GetAllStudiesResponse> {
    return this.http.get<GetAllStudiesResponse>(this.baseUrl, {
      headers: this.getHeaders(),
    });
  }

  
  getById(id: number | string): Observable<GetStudyByIdResponse> {
    return this.http.get<GetStudyByIdResponse>(`${this.baseUrl}/${id}`, {
      headers: this.getHeaders(),
    });
  }

  
  create(payload: StudyCreateI): Observable<{ study: StudyReadI }> {
    return this.http.post<{ study: StudyReadI }>(this.baseUrl, payload, {
      headers: this.getHeaders(),
    });
  }

  

  update(id: number | string, changes: Partial<StudyCreateI>): Observable<{ study: StudyReadI }> {
    return this.http.patch<{ study: StudyReadI }>(`${this.baseUrl}/${id}`, changes, {
      headers: this.getHeaders(),
    });
  }


  
  delete(id: number | string): Observable<DeleteStudyResponse> {
    return this.http.delete<DeleteStudyResponse>(`${this.baseUrl}/${id}`, {
      headers: this.getHeaders(),
    });
  }

  
  deleteHard(id: number | string): Observable<DeleteStudyResponse> {
    return this.http.delete<DeleteStudyResponse>(`${this.baseUrl}/${id}/hard`, {
      headers: this.getHeaders(),
    });
  }

  
  setLocal(list: StudyReadI[]): void {
    this.studiesSubject.next(list);
  }

  refresh(): void {
    this.getAll().subscribe({
      next: ({ studies }) => this.studiesSubject.next(studies),
      error: (err) => console.error('Error refreshing studies', err),
    });
  }
}
