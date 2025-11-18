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
  // Ajusta la URL si tu backend usa otra ruta
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

  /**
   * GET /images
   * Si pasas estudioId, hace /images?estudioId=...
   * El backend responde { images: ImageI[] }, así que mapeamos res.images.
   */
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

  /**
   * GET /images/:id
   */
  getImageById(id: number | string): Observable<ImageI> {
    return this.http.get<ImageI>(`${this.baseUrl}/${id}`, {
      headers: this.getHeaders()
    });
  }

  /**
   * POST /images
   * Backend espera multipart/form-data:
   *  - campo 'file' (archivo)
   *  - estudioId, tipo, serie?, orden?
   *
   * Aquí se recomienda recibir un FormData ya construido desde el componente.
   */
  createImage(formData: FormData): Observable<ImageI> {
    // Importante: NO fijar manualmente Content-Type para multipart
    return this.http.post<ImageI>(this.baseUrl, formData, {
      headers: this.getHeaders()
    });
  }

  /**
   * PATCH /images/:id
   * Actualiza metadatos de la imagen (no reemplaza archivo).
   */
  updateImage(id: number | string, payload: Partial<ImageI>): Observable<ImageI> {
    return this.http.patch<ImageI>(`${this.baseUrl}/${id}`, payload, {
      headers: this.getHeaders()
    });
  }

  /**
   * DELETE físico /images/:id
   * (borra archivo del disco y elimina el registro)
   */
  deleteImage(id: number | string): Observable<{ message: string }> {
    return this.http.delete<{ message: string }>(`${this.baseUrl}/${id}`, {
      headers: this.getHeaders()
    });
  }

  /**
   * DELETE lógico /images/:id/logic
   * (marca status = 'INACTIVE' en el backend)
   */
  deleteImageAdv(id: number | string): Observable<{ message: string }> {
    return this.http.delete<{ message: string }>(`${this.baseUrl}/${id}/logic`, {
      headers: this.getHeaders()
    });
  }

  // ========= Estado local como en PatientService =========

  updateLocalImages(images: ImageI[]): void {
    this.imagesSubject.next(images);
  }

  refreshImages(estudioId?: number): void {
    this.getAllImages(estudioId).subscribe(images => {
      this.imagesSubject.next(images);
    });
  }
}
