// src/app/features/citas/showcitas.ts
import { Component } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Observable } from 'rxjs';

import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { TagModule } from 'primeng/tag';
import { InputTextModule } from 'primeng/inputtext';
import { FormsModule } from '@angular/forms'; 

import { CitaService } from '../../../services/quote';
import { CitaI, EstadoCita } from '../../../models/quotes';

@Component({
  selector: 'app-showcitas',
  standalone: true,
  imports: [
    CommonModule, RouterModule, DatePipe,
    TableModule, ButtonModule, TagModule, InputTextModule, FormsModule
  ],
  templateUrl: './showquotes.html'
})
export class Showquotes {
  citas$: Observable<CitaI[]>;
  globalFilter = '';

  constructor(private citaService: CitaService) {
    this.citas$ = this.citaService.citas$;
  }

  tagSeverity(estado: EstadoCita) {
    switch (estado) {
      case 'PENDIENTE':  return 'warn';
      case 'CONFIRMADA': return 'info';
      case 'ATENDIDA':   return 'success';
      case 'CANCELADA':  return 'danger';
      default:           return 'info';
    }
  }

  get filtered(): CitaI[] {
    return this.citaService.search(this.globalFilter);
  }

  delete(row: CitaI) { this.citaService.remove(row.id); }
}
