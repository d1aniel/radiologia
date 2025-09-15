import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';

import { InputTextModule } from 'primeng/inputtext';
import { SelectModule } from 'primeng/select';
import { ButtonModule } from 'primeng/button';
import { DatePickerModule } from 'primeng/datepicker';
import { MultiSelectModule } from 'primeng/multiselect';

import { StudiesService } from '../../../services/studie';
import { Prioridad } from '../../../models/studies';
import { TagsService } from '../../../services/label';

@Component({
  selector: 'app-createstudies',
  standalone: true,
  imports: [
    CommonModule, ReactiveFormsModule, RouterModule,
    InputTextModule, SelectModule, ButtonModule,
    DatePickerModule, MultiSelectModule
  ],
  templateUrl: './createstudies.html',
  styleUrls: ['./createstudies.css']
})
export class Createstudies {
  private fb = inject(FormBuilder);
  private router = inject(Router);
  private studiesService = inject(StudiesService);
  private tagsService = inject(TagsService);

  prioridades: { label: string; value: Prioridad }[] = [
    { label: 'Baja', value: 'BAJA' },
    { label: 'Media', value: 'MEDIA' },
    { label: 'Alta', value: 'ALTA' },
    { label: 'Urgente', value: 'URGENTE' }
  ];

  /** Opciones multiselect (solo activas) */
  etiquetasOptions = this.tagsService.value
    .filter(t => t.status === 'ACTIVATE')
    .map(t => ({ label: t.nombre, value: t.id }));

  form = this.fb.group({
    paciente: ['', [Validators.required, Validators.minLength(2)]],
    modalidad: ['', Validators.required],
    equipo: ['', Validators.required],
    fechaHora: [new Date(), Validators.required], // Date en el form
    prioridad: ['MEDIA' as Prioridad, Validators.required],
    motivo: ['', [Validators.required, Validators.minLength(5)]],
    tecnologo: ['', Validators.required],
    medico: ['', Validators.required],
    etiquetas: [[] as number[]] // IDs de etiquetas
  });

  get f() { return this.form.controls; }

  onSubmit() {
    if (this.form.invalid) { this.form.markAllAsTouched(); return; }
    const v = this.form.value;

    this.studiesService.add({
      paciente:  v.paciente!,
      modalidad: v.modalidad!,
      equipo:    v.equipo!,
      fechaHora: (v.fechaHora as Date).toISOString(), // Date -> ISO
      prioridad: v.prioridad!,
      motivo:    v.motivo!,
      tecnologo: v.tecnologo!,
      medico:    v.medico!,
      etiquetas: (v.etiquetas ?? []) as number[]
    });

    this.router.navigate(['/studies/show']);
  }

  onCancel() { this.router.navigate(['/studies/show']); }
}
