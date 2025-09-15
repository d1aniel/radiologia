import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Observable } from 'rxjs';

import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { TagModule } from 'primeng/tag';

import { ModalidadService } from '../../../services/modaliti';
import { ModalidadI } from '../../../models/modalities';

@Component({
  selector: 'app-showmodalidad',
  standalone: true,
  imports: [CommonModule, RouterModule, TableModule, ButtonModule, TagModule],
  templateUrl: './showmodalities.html',
  styleUrls: ['./showmodalities.css']
})
export class Showmodalities {
  modalidades$: Observable<ModalidadI[]>;
  constructor(private service: ModalidadService) {
    this.modalidades$ = this.service.modalidades$;
  }

  actTag(activa: boolean) {
    return { severity: activa ? 'success' : 'danger', label: activa ? 'Sí' : 'No' };
  }

  delete(row: ModalidadI) { this.service.remove(row.id); }
}
