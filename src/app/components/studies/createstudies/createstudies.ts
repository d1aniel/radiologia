import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';

import { InputTextModule } from 'primeng/inputtext';
import { SelectModule } from 'primeng/select';
import { ButtonModule } from 'primeng/button';
import { DatePickerModule } from 'primeng/datepicker';
import { AutoCompleteModule } from 'primeng/autocomplete';

import { StudiesService } from '../../../services/studie';
import { Prioridad } from '../../../models/studies';

@Component({
  selector: 'app-createstudies',
  standalone: true,
  imports: [
    CommonModule, ReactiveFormsModule, RouterModule,
    InputTextModule, SelectModule, ButtonModule,
    DatePickerModule, AutoCompleteModule
  ],
  templateUrl: './createstudies.html',
  styleUrls: ['./createstudies.css']
})
export class Createstudies {
  private fb = inject(FormBuilder);
  private router = inject(Router);
  private studiesService = inject(StudiesService);

  prioridades: { label: string; value: Prioridad }[] = [
    { label: 'Baja', value: 'BAJA' },
    { label: 'Media', value: 'MEDIA' },
    { label: 'Alta', value: 'ALTA' },
    { label: 'Urgente', value: 'URGENTE' }
  ];

  // Catálogo de etiquetas sugeridas (puedes cargarlo desde servicio si quieres)
  etiquetasCatalogo: string[] = [
    'Trauma', 'Columna', 'Cefalea', 'Postoperatorio', 'Control', 'Prioritario', 'Pediatría', 'Oncología'
  ];
  filteredEtiquetas: string[] = [];

  form = this.fb.group({
    paciente: ['', [Validators.required, Validators.minLength(2)]],
    modalidad: ['', Validators.required],
    equipo: ['', Validators.required],

    // DatePicker trabaja con Date en el form
    fechaHora: [new Date(), Validators.required],

    prioridad: ['MEDIA' as Prioridad, Validators.required],
    motivo: ['', [Validators.required, Validators.minLength(5)]],
    tecnologo: ['', Validators.required],
    medico: ['', Validators.required],

    // AutoComplete multiple: string[]
    etiquetas: [[] as string[]]
  });

  get f() { return this.form.controls; }

  // Autocomplete: filtra por lo que escribe el usuario
  filterEtiquetas(event: { query: string }) {
    const query = (event?.query ?? '').toLowerCase();
    this.filteredEtiquetas = this.etiquetasCatalogo.filter(tag =>
      tag.toLowerCase().includes(query)
    );

    // Si quieres permitir nuevas etiquetas que no estén en catálogo, deja forceSelection = false en el HTML
  }

  onSubmit() {
    if (this.form.invalid) { this.form.markAllAsTouched(); return; }

    const v = this.form.value;

    this.studiesService.add({
      paciente: v.paciente!,
      modalidad: v.modalidad!,
      equipo: v.equipo!,

      // Convertimos Date -> ISO para guardar
      fechaHora: (v.fechaHora as Date).toISOString(),

      prioridad: v.prioridad!,
      motivo: v.motivo!,
      tecnologo: v.tecnologo!,
      medico: v.medico!,
      etiquetas: (v.etiquetas ?? []) as string[]
    });

    this.router.navigate(['/studies/show']);
  }

  onCancel() {
    this.router.navigate(['/studies/show']);
  }
}
