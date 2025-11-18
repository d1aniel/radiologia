// src/app/components/patients/createpatients/createpatients.ts
import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { Select } from 'primeng/select';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';

import { PatientService } from '../../../services/patient'; 

@Component({
  selector: 'app-create-patients',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, ButtonModule, InputTextModule, Select, ToastModule],
  templateUrl: './createpatients.html',
  styleUrls: ['./createpatients.css'],
  providers: [MessageService]
})
export class Createpatients {
  form: FormGroup;
  loading = false;

  // Opciones (coinciden con tu modelo/backend)
  statusOptions = [
    { label: 'Activo', value: 'ACTIVATE' },
    { label: 'Inactivo', value: 'INACTIVE' }
  ];

  tiposDocumento = [
    { label: 'Cédula', value: 'cedula' },
    { label: 'Tarjeta de Identidad', value: 'tarjeta' },
    { label: 'Pasaporte', value: 'pasaporte' }
  ];

  sexoOptions = [
    { label: 'Masculino', value: 'M' },
    { label: 'Femenino', value: 'F' },
    { label: 'Otro', value: 'O' }
  ];

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private patientsService: PatientService,
    private messageService: MessageService
  ) {
    this.form = this.fb.group({
      nombre: ['', [Validators.required, Validators.minLength(2)]],
      apellido: ['', [Validators.required, Validators.minLength(2)]],
      tpdocumento: ['cedula', Validators.required],
      documento: ['', [Validators.required, Validators.pattern(/^\d{6,15}$/)]],
      sexo: ['', Validators.required], // M | F | O según tu modelo
      telefono: ['', [Validators.required, Validators.pattern(/^\d{7,15}$/)]],
      eps: ['', [Validators.required, Validators.minLength(2)]],
      correo: ['', [Validators.required, Validators.email]],
      status: ['ACTIVATE', Validators.required]
    });
  }

  submit(): void {
    if (this.form.valid) {
      this.loading = true;
      const payload = this.form.value;

      this.patientsService.createPatient(payload).subscribe({
        next: () => {
          this.messageService.add({
            severity: 'success',
            summary: 'Éxito',
            detail: 'Paciente creado correctamente'
          });
          setTimeout(() => {
            // Ajusta la ruta según tu listado (ej: '/patients' o '/patients/show')
            this.router.navigate(['/patients/show']);
          }, 800);
        },
        error: (error) => {
          console.error('Error creating patient:', error);
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: error?.error?.error || 'Error al crear el paciente'
          });
          this.loading = false;
        }
      });
    } else {
      this.markFormGroupTouched();
      this.messageService.add({
        severity: 'warn',
        summary: 'Advertencia',
        detail: 'Por favor complete todos los campos requeridos'
      });
    }
  }

  cancelar(): void {
    // Ajusta la ruta según tu listado (ej: '/patients' o '/patients/show')
    this.router.navigate(['/patients/show']);
  }

  private markFormGroupTouched(): void {
    Object.keys(this.form.controls).forEach(key => {
      this.form.get(key)?.markAsTouched();
    });
  }

  getFieldError(fieldName: string): string {
    const field = this.form.get(fieldName);
    if (field?.errors && field?.touched) {
      if (field.errors['required']) return `${fieldName} es requerido`;
      if (field.errors['email']) return 'Correo no válido';
      if (field.errors['minlength']) {
        return `${fieldName} debe tener al menos ${field.errors['minlength'].requiredLength} caracteres`;
      }
      if (field.errors['pattern']) {
        if (fieldName === 'documento') return 'Documento debe tener entre 6 y 15 dígitos';
        if (fieldName === 'telefono') return 'Teléfono debe tener entre 7 y 15 dígitos';
        return 'Formato no válido';
      }
    }
    return '';
  }
}
