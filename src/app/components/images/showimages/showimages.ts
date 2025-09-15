// src/app/features/images/showimages.ts
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { RouterModule } from '@angular/router';

import { ImagesService } from '../../../services/image';     // ajusta la ruta si difiere
import { ImageI } from '../../../models/images';
import { StudiesService } from '../../../services/studie';    // usa tu servicio real

@Component({
  selector: 'app-show-images',
  standalone: true,
  imports: [CommonModule, TableModule, ButtonModule, RouterModule],
  templateUrl: './showimages.html'
})
export class Showimages {
  images: ImageI[] = [];
  // Mapa: estudioId -> etiqueta amigable (Paciente — Modalidad — Equipo)
  studyLabelById = new Map<number, string>();

  constructor(
    private imagesService: ImagesService,
    private studiesService: StudiesService
  ) {
    this.imagesService.images$.subscribe(list => (this.images = list));

    // Construimos el mapa de etiquetas con tu estructura real
    this.studiesService.getAll().forEach(s => {
      const label = `${s.paciente} — ${s.modalidad} — ${s.equipo}`;
      this.studyLabelById.set(s.id, label);
    });
  }

  getStudyLabel(id: number): string {
    return this.studyLabelById.get(id) ?? `Estudio ${id}`;
  }

  fmtBytes(bytes: number): string {
    if (bytes == null) return '';
    const k = 1024;
    const units = ['B', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k)) || 0;
    return `${(bytes / Math.pow(k, i)).toFixed(2)} ${units[i]}`;
  }
}
