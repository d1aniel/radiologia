// src/app/features/agenda-modalidad/showmodalidadagenda.ts
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { TagModule } from 'primeng/tag';
import { ChipModule } from 'primeng/chip';
import { SelectModule } from 'primeng/select';
import { DatePickerModule } from 'primeng/datepicker';

import { Observable } from 'rxjs';
import { AgendaModalidadService } from '../../../services/agendamodality';
import { AgendaModalidadI } from '../../../models/agendamodality';

@Component({
  selector: 'app-showmodalidadagenda',
  standalone: true,
  imports: [
    CommonModule, FormsModule, RouterModule,
    TableModule, ButtonModule, TagModule, ChipModule,
    SelectModule, DatePickerModule
  ],
  templateUrl: './showagendabymodality.html',
  styleUrls: ['./showagendabymodality.css']
})
export class Showagendabymodality {
  agenda$: Observable<AgendaModalidadI[]>;

  // Opciones para p-select como objetos {label,value} (más seguro que string[])
  modalidadOptions: { label: string; value: string }[] = [];
  modalidadSel: string | null = null;

  fechaSel: Date | null = new Date();

  constructor(private agendaSrv: AgendaModalidadService) {
    this.agenda$ = this.agendaSrv.agenda$;

    // Convertimos las modalidades únicas a {label,value}
    const mods = this.agendaSrv.uniqueModalidades();
    this.modalidadOptions = mods.map(m => ({ label: m, value: m }));
    this.modalidadSel = mods.length ? mods[0] : null;
  }

  onFiltroChange() {
    // No hace falta nada con datos en memoria; la tabla filtra en rowsForView()
  }

  rowsForView(list: AgendaModalidadI[]) {
    const mod = this.modalidadSel;
    const dt = this.fechaSel;
    if (!mod) return [];
    return list.filter(x => {
      const sameMod = x.modalidad === mod;
      if (!dt) return sameMod;
      const d = new Date(x.fechaHora);
      return sameMod &&
             d.getFullYear() === dt.getFullYear() &&
             d.getMonth() === dt.getMonth() &&
             d.getDate() === dt.getDate();
    });
  }

  severityPrioridad(p: AgendaModalidadI['prioridad']) {
    switch (p) {
      case 'URGENTE': return 'danger';
      case 'ALTA':    return 'warn';
      case 'MEDIA':   return 'info';
      default:        return 'success';
    }
  }

  severityEstado(e: AgendaModalidadI['estado']) {
    switch (e) {
      case 'PROGRAMADA': return 'info';
      case 'EN_CURSO':   return 'warn';
      case 'COMPLETADA': return 'success';
      case 'CANCELADA':  return 'danger';
      default:           return 'secondary';
    }
  }

  delete(row: AgendaModalidadI) {
    this.agendaSrv.remove(row.id);
  }
}
