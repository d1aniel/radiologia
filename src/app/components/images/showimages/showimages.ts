// src/app/components/images/showimages/showimages.ts
import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { RouterModule } from '@angular/router';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ToastModule } from 'primeng/toast';
import { DialogModule } from 'primeng/dialog';
import { ConfirmationService, MessageService } from 'primeng/api';

import { BehaviorSubject, EMPTY, Observable } from 'rxjs';
import { catchError, map, shareReplay, startWith, switchMap, tap } from 'rxjs/operators';

import { ImageService } from '../../../services/image';
import { ImageI, TipoImagen } from '../../../models/images';
import { StudyService } from '../../../services/studie';
import { StudyReadI } from '../../../models/studies';

@Component({
  selector: 'app-show-images',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    TableModule,
    ButtonModule,
    ConfirmDialogModule,
    ToastModule,
    DialogModule
  ],
  templateUrl: './showimages.html',
  styleUrls: ['./showimages.css'],
  encapsulation: ViewEncapsulation.None,
  providers: [ConfirmationService, MessageService, DatePipe]
})
export class Showimages implements OnInit {
  // URL base del backend (ajusta si usas otra)
  private readonly backendBaseUrl = 'http://localhost:4000';

  private estudioIdFilter?: number;
  private refresh$ = new BehaviorSubject<void>(undefined);

  images$: Observable<ImageI[]> = this.refresh$.pipe(
    switchMap(() =>
      this.imageService.getAllImages(this.estudioIdFilter).pipe(
        tap(imgs => this.imageService.updateLocalImages(imgs)),
        catchError(err => {
          console.error('Error loading images:', err);
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Error al cargar las imágenes'
          });
          return EMPTY;
        })
      )
    ),
    shareReplay(1)
  );

  loading$: Observable<boolean> = this.images$.pipe(
    map(() => false),
    startWith(true)
  );

  // Mapa estudioId -> etiqueta
  studyLabelById = new Map<number, string>();

  // Estado para el modal de vista previa
  previewVisible = false;
  previewImage: ImageI | null = null;

  constructor(
    private imageService: ImageService,
    private studiesService: StudyService,
    private confirmationService: ConfirmationService,
    private messageService: MessageService
  ) {}

  ngOnInit(): void {
    this.loadStudyLabels();
  }

  filterByStudy(estudioId?: number): void {
    this.estudioIdFilter = estudioId ?? undefined;
    this.refresh$.next();
  }

  private loadStudyLabels(): void {
    this.studiesService.getAll().subscribe({
      next: ({ studies }) => {
        this.studyLabelById.clear();
        for (const study of studies ?? []) {
          this.studyLabelById.set(study.id, this.formatStudyLabel(study));
        }
      },
      error: () => {
        // no bloqueamos la vista si falla
      }
    });
  }

  getStudyLabel(id: number): string {
    return this.studyLabelById.get(id) ?? `Estudio ${id}`;
  }

  private formatStudyLabel(study: StudyReadI): string {
    const patientName = study.patient
      ? [study.patient.nombre, study.patient.apellido].filter(Boolean).join(' ').trim()
      : `Paciente #${study.patient_id}`;
    const modality = study.modalidad_obj?.nombre ?? 'N/A';
    const team = study.team_obj?.nombre ?? 'N/A';
    return `${patientName || 'Paciente'} — ${modality} — ${team}`;
  }

  fmtBytes(bytes?: number): string {
    if (bytes == null) return '';
    const k = 1024;
    const units = ['B', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k)) || 0;
    return `${(bytes / Math.pow(k, i)).toFixed(2)} ${units[i]}`;
  }

  // Abrir en otra pestaña
  onViewExternal(img: ImageI): void {
    const url = this.getImageFullUrl(img);
    if (url) window.open(url, '_blank');
  }

  // Vista previa en modal
  onPreview(img: ImageI): void {
    this.previewImage = img;
    this.previewVisible = true;
  }

  
  getImageFullUrl(img: ImageI | null): string {
    if (!img?.url) return '';

    // Normalizamos slashes
    let raw = img.url.replace(/\\/g, '/');

    // Si ya es URL absoluta http/https
    if (raw.startsWith('http://') || raw.startsWith('https://')) {
      return raw;
    }

    // Buscamos el segmento /uploads/ por si viene con ruta absoluta del server
    const uploadsIdx = raw.indexOf('/uploads/');
    if (uploadsIdx >= 0) {
      raw = raw.substring(uploadsIdx); // deja /uploads/...
    }

    // Nos aseguramos de que empiece con una sola /
    const relative = '/' + raw.replace(/^\/+/, '');

    // Devolvemos URL completa
    return `${this.backendBaseUrl}${relative}`;
  }

  // Solo previsualizamos JPG/PNG en el modal
  isPreviewable(tipo: TipoImagen | undefined): boolean {
    return tipo === 'JPG' || tipo === 'PNG';
  }

  deleteImage(img: ImageI): void {
    this.confirmationService.confirm({
      message: `¿Eliminar físicamente la imagen "${img.nombreArchivo}"? Esta acción no se puede deshacer.`,
      header: 'Confirmar eliminación',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        if (!img.id) return;
        this.imageService.deleteImage(img.id).subscribe({
          next: () => {
            this.messageService.add({
              severity: 'success',
              summary: 'Eliminada',
              detail: 'Imagen eliminada correctamente'
            });
            this.refresh$.next();
          },
          error: (err) => {
            console.error('Error deleting image:', err);
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: 'No se pudo eliminar la imagen'
            });
          }
        });
      }
    });
  }

  deleteImageAdv(img: ImageI): void {
    this.confirmationService.confirm({
      message: `¿Eliminar la imagen "${img.nombreArchivo}" (borrado ADV: también elimina el registro)?`,
      header: 'Confirmar desactivación',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        if (!img.id) return;
        this.imageService.deleteImageAdv(img.id).subscribe({
          next: () => {
            this.messageService.add({
              severity: 'info',
              summary: 'Actualizado',
              detail: 'Imagen eliminada (adv)'
            });
            this.refresh$.next();
          },
          error: (err) => {
            console.error('Error deleting image (adv):', err);
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: 'No se pudo eliminar la imagen'
            });
          }
        });
      }
    });
  }
}
