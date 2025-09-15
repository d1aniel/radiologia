// src/app/features/citas/createcitas.ts
import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';

import { InputTextModule } from 'primeng/inputtext';
import { SelectModule } from 'primeng/select';
import { ButtonModule } from 'primeng/button';
import { DatePickerModule } from 'primeng/datepicker';
import { TextareaModule } from 'primeng/textarea';

import { CitaService } from '../../../services/quote';
import { EstadoCita } from '../../../models/quotes';

@Component({
  selector: 'app-createcitas',
  standalone: true,
  imports: [
    CommonModule, ReactiveFormsModule, RouterModule,
    InputTextModule, SelectModule, ButtonModule, DatePickerModule, TextareaModule
  ],
  templateUrl: './createquotes.html'
})
export class Createquotes {
  private fb = inject(FormBuilder);
  private router = inject(Router);
  private citaService = inject(CitaService);

  modalidades = [
    { label: 'Rayos X (RX)', value: 'RX' },
    { label: 'Tomografía (TAC)', value: 'TAC' },
    { label: 'Resonancia (RM)', value: 'RM' }
  ];

  estados: { label: string; value: EstadoCita }[] = [
    { label: 'Pendiente',  value: 'PENDIENTE'  },
    { label: 'Confirmada', value: 'CONFIRMADA' },
    { label: 'Atendida',   value: 'ATENDIDA'   },
    { label: 'Cancelada',  value: 'CANCELADA'  }
  ];

  form = this.fb.group({
    paciente:   ['', [Validators.required, Validators.minLength(2)]],
    modalidad:  ['', Validators.required],
    equipo:     ['', Validators.required],
    fechaHora:  [new Date(), Validators.required],  // DatePicker usa Date
    tecnologo:  ['', Validators.required],
    motivo:     ['', [Validators.required, Validators.minLength(5)]],
    estado:     ['PENDIENTE' as EstadoCita, Validators.required]
  });

  get f() { return this.form.controls; }

  onSubmit() {
    if (this.form.invalid) { this.form.markAllAsTouched(); return; }
    const v = this.form.value;

    this.citaService.add({
      paciente:  v.paciente!,
      modalidad: v.modalidad!,
      equipo:    v.equipo!,
      fechaHora: (v.fechaHora as Date).toISOString(), // Date -> ISO
      tecnologo: v.tecnologo!,
      motivo:    v.motivo!,
      estado:    v.estado!
    });

    this.router.navigate(['/quotes/show']);
  }

  onCancel() {
    this.router.navigate(['/quotes/show']);
  }
}
