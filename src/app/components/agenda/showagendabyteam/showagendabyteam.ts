// src/app/features/agenda-equipo/showagendabyequipo.ts
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { TagModule } from 'primeng/tag';
import { ChipModule } from 'primeng/chip';
import { SelectModule } from 'primeng/select';
import { DatePickerModule } from 'primeng/datepicker';
import { InputTextModule } from 'primeng/inputtext';

import { Observable } from 'rxjs';
import { AgendaEquipoService } from '../../../services/agendateams';
import { AgendaEquipoI } from '../../../models/agendateams';
import { EstadoCita } from '../../../models/agendamodality';
import { Router } from '@angular/router';

@Component({
  selector: 'app-showagendabyequipo',
  standalone: true,
  imports: [
    CommonModule, FormsModule,
    TableModule, ButtonModule, TagModule, ChipModule,
    SelectModule, DatePickerModule, InputTextModule
  ],
  templateUrl: './showagendabyteam.html',
  styleUrls: ['./showagendabyteam.css']
})
export class Showagendabyteam {
  agenda$: Observable<AgendaEquipoI[]>;

  equiposOptions: { label: string; value: string }[] = [];
  modalidadesOptions: { label: string; value: string }[] = [];
  estadosOptions: { label: string; value: EstadoCita }[] = [];

  equipoSel: string | null = null;
  modalidadSel: string | null = null;   // opcional
  estadoSel: EstadoCita | null = null;  // opcional
  fechaSel: Date | null = new Date();
  filtroGlobal = '';

  constructor(
    private agendaSrv: AgendaEquipoService,
    private router: Router
  ) {
    this.agenda$ = this.agendaSrv.agenda$;

    this.equiposOptions = this.agendaSrv.uniqueEquipos().map(x => ({ label: x, value: x }));
    this.modalidadesOptions = this.agendaSrv.uniqueModalidades().map(x => ({ label: x, value: x }));
    this.estadosOptions = this.agendaSrv.uniqueEstados().map(x => ({ label: x, value: x as EstadoCita }));

    this.equipoSel = this.equiposOptions[0]?.value ?? null;
  }

  programarCita() {
    this.router.navigate(['agenda/create-byteam']);
  }

  rowsForView(list: AgendaEquipoI[]) {
    const dt = this.fechaSel;
    const eq = this.equipoSel;
    const md = this.modalidadSel;
    const es = this.estadoSel;

    const base = this.filtroGlobal
      ? this.agendaSrv.search(this.filtroGlobal)
      : list;

    const filtered = base.filter(x => {
      const sameEq = !eq || x.equipo === eq;
      const sameMod = !md || x.modalidad === md;
      const sameEst = !es || x.estado === es;
      const sameDay = !dt || (new Date(x.fechaHora).toDateString() === dt.toDateString());
      return sameEq && sameMod && sameEst && sameDay;
    }).sort((a, b) => +new Date(a.fechaHora) - +new Date(b.fechaHora));

    return filtered;
  }

  // Chips/colores sugeridos
  severityPrioridad(p: AgendaEquipoI['prioridad']) {
    switch (p) {
      case 'URGENTE': return 'danger';
      case 'ALTA':    return 'warn';
      case 'MEDIA':   return 'info';
      default:        return 'success';
    }
  }

  severityEstado(e: AgendaEquipoI['estado']) {
    switch (e) {
      case 'PROGRAMADA': return 'info';     // azul
      case 'EN_CURSO':   return 'warn';     // amarillo
      case 'COMPLETADA': return 'success';  // verde
      case 'CANCELADA':  return 'danger';   // rojo
      default:           return 'secondary';
    }
  }

  equipoEstado(equipo: string) {
    return this.agendaSrv.equipoEstadoActual(equipo) ?? 'DISPONIBLE';
  }

  metricas(equipo: string) {
    const fecha = this.fechaSel ?? new Date();
    const m = this.agendaSrv.ocupacionEquipo(equipo, fecha);
    const next = this.agendaSrv.proximoEspacioLibre(equipo, fecha);
    return {
      ...m,
      proximoLibre: next ? next.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '—'
    };
  }

  // Acciones
  reprogramar(row: AgendaEquipoI) {
    // TODO: abrir modal/drawer con form de cambio de fecha/hora/equipo
  }

  delete(row: AgendaEquipoI) {
    this.agendaSrv.remove(row.id);
  }
}
