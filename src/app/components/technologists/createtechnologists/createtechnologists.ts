import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { Select } from 'primeng/select';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';

import { TechnologistService } from '../../../services/technologist';

@Component({
  selector: 'app-create-technologists',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, ButtonModule, InputTextModule, Select, ToastModule],
  templateUrl: './createtechnologists.html',
  styleUrls: ['./createtechnologists.css'],
  providers: [MessageService]
})
export class Createtechnologists {
  form: FormGroup;
  loading = false;

  // Opciones de estado (coinciden con backend)
  statusOptions = [
    { label: 'Activo', value: 'ACTIVE' },
    { label: 'Inactivo', value: 'INACTIVE' }
  ];

  // Opciones de especialidad
  especialidadOptions = [
    { label: 'Rayos X', value: 'RX' },
    { label: 'Tomografía (TAC)', value: 'TAC' },
    { label: 'Resonancia (RM)', value: 'RM' }
  ];

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private technologistService: TechnologistService,
    private messageService: MessageService
  ) {
    this.form = this.fb.group({
      nombre: ['', [Validators.required, Validators.minLength(2)]],
      especialidad: ['', Validators.required],
      // Permite dígitos, + y espacios, entre 7 y 20 caracteres
      telefono: ['', [Validators.required, Validators.pattern(/^[0-9+\s]{7,20}$/)]],
      correo: ['', [Validators.required, Validators.email]],
      status: ['ACTIVE', Validators.required]
    });
  }

  submit(): void {
    if (this.form.valid) {
      this.loading = true;
      const payload = this.form.value; // TecnologoI compatible

      this.technologistService.createTechnologist(payload).subscribe({
        next: () => {
          this.messageService.add({
            severity: 'success',
            summary: 'Éxito',
            detail: 'Tecnólogo creado correctamente'
          });
          setTimeout(() => {
            this.router.navigate(['/technologists/show']);
          }, 800);
        },
        error: (error) => {
          console.error('Error creating technologist:', error);
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: error?.error?.error || 'Error al crear el tecnólogo'
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
    this.router.navigate(['/technologists/show']);
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
        if (fieldName === 'telefono') {
          return 'Teléfono debe tener entre 7 y 20 caracteres (números, espacios o +)';
        }
        return 'Formato no válido';
      }
    }
    return '';
  }
}
