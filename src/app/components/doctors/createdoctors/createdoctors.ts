import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';

import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { SelectModule } from 'primeng/select';

import { MedicosService } from '../../../services/doctor';

@Component({
  selector: 'app-create-medico',
  standalone: true,
  imports: [
    CommonModule, ReactiveFormsModule, RouterModule,
    InputTextModule, ButtonModule, SelectModule
  ],
  templateUrl: './createdoctors.html'
})
export class CreateMedico {
  form: FormGroup;

  estados = [
    { label: 'Activo', value: 'ACTIVATE' },
    { label: 'Inactivo', value: 'INACTIVE' }
  ];

  especialidades = [
    { label: 'Radiología General', value: 'Radiología General' },
    { label: 'Neurorradiología', value: 'Neurorradiología' },
    { label: 'MSK (Musculoesquelética)', value: 'MSK (Musculoesquelética)' },
    { label: 'Pediátrica', value: 'Pediátrica' },
    { label: 'Intervencionista', value: 'Intervencionista' }
  ];

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private medicosService: MedicosService
  ) {
    this.form = this.fb.group({
      nombre: ['', [Validators.required, Validators.minLength(2)]],
      especialidad: ['', Validators.required],
      telefono: ['', [Validators.required, Validators.pattern(/^\d{7,15}$/)]],
      correo: ['', [Validators.required, Validators.email]],
      registro: [''], // opcional
      status: ['ACTIVATE', Validators.required]
    });
  }

  get f() {
    return this.form.controls;
  }

  onSubmit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.medicosService.addMedico(this.form.value as any);
    this.router.navigate(['/medicos/show']);
  }

  onCancel() {
    this.router.navigate(['/medicos/show']);
  }
}
