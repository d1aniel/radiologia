import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { map } from 'rxjs/operators';

import { ImageI } from '../models/images';
import { AuthService } from '../services/auth';

@Injectable({
  providedIn: 'root'
})
export class ImageService {
  
  private baseUrl = 'http://localhost:4000/api/images';

  private imagesSubject = new BehaviorSubject<ImageI[]>([]);
  public images$ = this.imagesSubject.asObservable();

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

  
  getAllImages(estudioId?: number): Observable<ImageI[]> {
    let params = new HttpParams();
    if (estudioId != null) {
      params = params.set('estudioId', estudioId.toString());
    }

    return this.http
      .get<{ images: ImageI[] }>(this.baseUrl, {
        headers: this.getHeaders(),
        params
      })
      .pipe(
        map(res => res.images)
      );
  }

  
  getImageById(id: number | string): Observable<ImageI> {
    return this.http.get<ImageI>(`${this.baseUrl}/${id}`, {
      headers: this.getHeaders()
    });
  }

  
  createImage(formData: FormData): Observable<ImageI> {
    
    return this.http.post<ImageI>(this.baseUrl, formData, {
      headers: this.getHeaders()
    });
  }

  
  updateImage(id: number | string, payload: Partial<ImageI>): Observable<ImageI> {
    return this.http.patch<ImageI>(`${this.baseUrl}/${id}`, payload, {
      headers: this.getHeaders()
    });
  }

  
  deleteImage(id: number | string): Observable<{ message: string }> {
    return this.http.delete<{ message: string }>(`${this.baseUrl}/${id}`, {
      headers: this.getHeaders()
    });
  }

  
  deleteImageAdv(id: number | string): Observable<{ message: string }> {
    return this.http.delete<{ message: string }>(`${this.baseUrl}/${id}/logic`, {
      headers: this.getHeaders()
    });
  }

  

  updateLocalImages(images: ImageI[]): void {
    this.imagesSubject.next(images);
  }

  refreshImages(estudioId?: number): void {
    this.getAllImages(estudioId).subscribe(images => {
      this.imagesSubject.next(images);
    });
  }
}
