import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { SelectModule } from 'primeng/select';
import { PatientsService } from '../../../services/patient';

@Component({
  selector: 'app-create-patients',
  standalone: true,
  imports: [
    CommonModule, ReactiveFormsModule, RouterModule,
    InputTextModule, ButtonModule, SelectModule
  ],
  templateUrl: './createpatients.html'
})
export class Createpatients {
  constructor(
    private fb: FormBuilder,
    private router: Router,
    private patientsService: PatientsService
  ) {
    this.form = this.fb.group({
      nombre: ['', [Validators.required, Validators.minLength(2)]],
      apellido: ['', [Validators.required, Validators.minLength(2)]],
      tpdocumento: ['cedula', Validators.required],
      documento: ['', [Validators.required, Validators.pattern(/^\d{6,15}$/)]],
      sexo: ['',[ Validators.required,]],
      telefono: ['', [Validators.required, Validators.pattern(/^\d{7,15}$/)]],
      eps: ['', Validators.required],
      correo: ['', [Validators.required, Validators.email]],
      status: ['ACTIVATE', Validators.required]
    });
  }

  tiposDocumento = [
    { label: 'Cédula', value: 'cedula' },
    { label: 'Tarjeta de Identidad', value: 'tarjeta' },
    { label: 'Pasaporte', value: 'pasaporte' }
  ];

  form: FormGroup;

  get f() {
    return this.form.controls;
  }

  onSubmit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.patientsService.addPatient(this.form.value as any);
    this.router.navigate(['/patients/show']);
  }

  onCancel() {
    this.router.navigate(['/patients/show']);
  }
}
