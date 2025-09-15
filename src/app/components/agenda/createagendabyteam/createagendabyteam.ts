// src/app/features/agenda-equipo/createagendabyequipo.ts
import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';

import { InputTextModule } from 'primeng/inputtext';
import { SelectModule } from 'primeng/select';
import { ButtonModule } from 'primeng/button';
import { DatePickerModule } from 'primeng/datepicker';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { ChipModule } from 'primeng/chip';

import { AgendaEquipoService } from '../../../services/agendateams';
import { AgendaEquipoI } from '../../../models/agendateams';
import { Prioridad } from '../../../models/agendamodality';

@Component({
  selector: 'app-createagendabyequipo',
  standalone: true,
  imports: [
    CommonModule, ReactiveFormsModule, RouterModule,
    InputTextModule, SelectModule, ButtonModule,
    DatePickerModule, AutoCompleteModule, ChipModule
  ],
  templateUrl: './createagendabyteam.html',
  styleUrls: ['./createagendabyteam.css']
})
export class Createagendabyteam {
  private fb = inject(FormBuilder);
  private router = inject(Router);
  private agendaSrv = inject(AgendaEquipoService);

  prioridades: { label: string; value: Prioridad }[] = [
    { label: 'Baja', value: 'BAJA' },
    { label: 'Media', value: 'MEDIA' },
    { label: 'Alta', value: 'ALTA' },
    { label: 'Urgente', value: 'URGENTE' }
  ];
  modalidades: string[] = ['RX', 'TAC', 'RM'];
  equipos: string[] = this.agendaSrv.uniqueEquipos().length
    ? this.agendaSrv.uniqueEquipos()
    : ['RX-01', 'TAC-Sala A', 'RM-1'];

  etiquetasCatalogo: string[] = ['Urgente', 'Pediatría', 'Control', 'Columna', 'Cráneo', 'Trauma'];
  filteredEtiquetas: string[] = [];

  form = this.fb.group({
    paciente: ['', [Validators.required, Validators.minLength(2)]],
    documento: ['', [Validators.required, Validators.minLength(5)]],
    modalidad: ['', Validators.required],
    equipo: ['', Validators.required],

    fechaHora: [new Date(), Validators.required],
    duracionMinutos: [30, [Validators.required, Validators.min(5), Validators.max(240)]],

    prioridad: ['MEDIA' as Prioridad, Validators.required],
    motivo: ['', [Validators.required, Validators.minLength(5)]],
    tecnologo: ['', Validators.required],
    medico: ['', Validators.required],

    etiquetas: [[] as string[]]
  });

  get f() { return this.form.controls; }

  filterEtiquetas(event: { query: string }) {
    const q = (event?.query ?? '').toLowerCase();
    this.filteredEtiquetas = this.etiquetasCatalogo.filter(x => x.toLowerCase().includes(q));
  }

  onSubmit() {
    if (this.form.invalid) { this.form.markAllAsTouched(); return; }
    const v = this.form.value;

    const payload: Omit<AgendaEquipoI, 'id'> = {
      paciente: v.paciente!,
      documento: v.documento!,
      modalidad: v.modalidad!,
      equipo: v.equipo!,
      tecnologo: v.tecnologo!,
      medico: v.medico!,
      fechaHora: (v.fechaHora as Date).toISOString(),
      duracionMinutos: v.duracionMinutos!,
      prioridad: v.prioridad!,
      motivo: v.motivo!,
      etiquetas: (v.etiquetas ?? []) as string[],
      estado: 'PROGRAMADA',
      equipoEstado: 'DISPONIBLE'
    };

    this.agendaSrv.add(payload);
    this.router.navigate(['/agenda-equipo/show']);
  }

  onCancel() {
    this.router.navigate(['/agenda-equipo/show']);
  }
}
