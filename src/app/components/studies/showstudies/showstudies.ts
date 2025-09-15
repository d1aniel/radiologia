import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { TagModule } from 'primeng/tag';
import { ChipModule } from 'primeng/chip';
import { RouterModule } from '@angular/router';
import { Observable } from 'rxjs';
import { StudiesService } from '../../../services/studie';
import { StudiesI } from '../../../models/studies';

@Component({
  selector: 'app-showstudies',
  standalone: true,
  imports: [CommonModule, TableModule, ButtonModule, RouterModule, TagModule, ChipModule],
  templateUrl: './showstudies.html',
  styleUrls: ['./showstudies.css']
})
export class Showstudies {
  studies$: Observable<StudiesI[]>;
  constructor(private studiesService: StudiesService) {
    this.studies$ = this.studiesService.studies$;
  }

  severity(prioridad: StudiesI['prioridad']) {
    switch (prioridad) {
      case 'URGENTE': return 'danger';
      case 'ALTA':    return 'warn';
      case 'MEDIA':   return 'info';
      default:        return 'success';
    }
  }

  delete(row: StudiesI) { this.studiesService.remove(row.id); }
}
