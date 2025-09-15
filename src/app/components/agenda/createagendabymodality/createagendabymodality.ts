// src/app/features/agenda-modalidad/createmodalidadagenda.ts
import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';

import { InputTextModule } from 'primeng/inputtext';
import { SelectModule } from 'primeng/select';
import { ButtonModule } from 'primeng/button';
import { DatePickerModule } from 'primeng/datepicker';
import { AutoCompleteModule } from 'primeng/autocomplete';

import { AgendaModalidadService } from '../../../services/agendamodality';
import { Prioridad } from '../../../models/agendamodality';

@Component({
  selector: 'app-createmodalidadagenda',
  standalone: true,
  imports: [
    CommonModule, ReactiveFormsModule, RouterModule,
    InputTextModule, SelectModule, ButtonModule,
    DatePickerModule, AutoCompleteModule
  ],
  templateUrl: './createagendabymodality.html',
  styleUrls: ['./createagendabymodality.css']
})
export class Createagendabymodality {
  private fb = inject(FormBuilder);
  private router = inject(Router);
  private agendaSrv = inject(AgendaModalidadService);

  prioridades: { label: string; value: Prioridad }[] = [
    { label: 'Baja', value: 'BAJA' },
    { label: 'Media', value: 'MEDIA' },
    { label: 'Alta', value: 'ALTA' },
    { label: 'Urgente', value: 'URGENTE' }
  ];

  modalidades: string[] = ['RX', 'TAC', 'RM'];
  etiquetasCatalogo: string[] = [
    'Tórax', 'Cráneo', 'Columna', 'Control', 'Trauma', 'Pediatría', 'Oncología'
  ];
  filteredEtiquetas: string[] = [];

  form = this.fb.group({
    paciente: ['', [Validators.required, Validators.minLength(2)]],
    modalidad: ['', Validators.required],
    equipo: ['', Validators.required],

    fechaHora: [new Date(), Validators.required],

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

    this.agendaSrv.add({
      paciente: v.paciente!,
      modalidad: v.modalidad!,
      equipo: v.equipo!,
      fechaHora: (v.fechaHora as Date).toISOString(),
      prioridad: v.prioridad!,
      motivo: v.motivo!,
      tecnologo: v.tecnologo!,
      medico: v.medico!,
      etiquetas: (v.etiquetas ?? []) as string[],
      estado: 'PROGRAMADA' // por defecto al crear
    });

    this.router.navigate(['/agenda-modalidad/show']);
  }

  onCancel() {
    this.router.navigate(['/agenda-modalidad/show']);
  }
}
