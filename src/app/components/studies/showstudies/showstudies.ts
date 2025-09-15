import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { TagModule } from 'primeng/tag';
import { ChipModule } from 'primeng/chip';

import { Observable } from 'rxjs';
import { StudiesService } from '../../../services/studie';
import { StudiesI } from '../../../models/studies';
import { TagsService } from '../../../services/label';
import { LabelsI } from '../../../models/labels';

@Component({
  selector: 'app-showstudies',
  standalone: true,
  imports: [CommonModule, RouterModule, TableModule, ButtonModule, TagModule, ChipModule],
  templateUrl: './showstudies.html',
  styleUrls: ['./showstudies.css']
})
export class Showstudies {
  private tagsService = inject(TagsService);
  private studiesService = inject(StudiesService);

  studies$: Observable<StudiesI[]> = this.studiesService.studies$;

  /** Mapa id -> nombre (se arma una sola vez) */
  etiquetasMap = new Map<number, string>(
    this.tagsService.value.map((t: LabelsI) => [t.id, t.nombre] as [number, string])
  );

  severity(prioridad: StudiesI['prioridad']) {
    switch (prioridad) {
      case 'URGENTE': return 'danger';
      case 'ALTA':    return 'warn';
      case 'MEDIA':   return 'info';
      default:        return 'success';
    }
  }

  /** Convierte IDs de etiquetas del row en nombres */
  labelNames(row: StudiesI): string[] {
    return (row.etiquetas ?? []).map(id => this.etiquetasMap.get(id) ?? `#${id}`);
  }

  delete(row: StudiesI) { this.studiesService.remove(row.id); }
}
