
import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { Select } from 'primeng/select';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';

import { MedicoService } from '../../../services/doctor';

@Component({
  selector: 'app-create-doctors',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    ButtonModule,
    InputTextModule,
    Select,
    ToastModule
  ],
  templateUrl: './createdoctors.html',
  styleUrls: ['./createdoctors.css'],
  providers: [MessageService]
})
export class Createdoctors {
  form: FormGroup;
  loading = false;

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
    private medicoService: MedicoService,
    private messageService: MessageService
  ) {
    this.form = this.fb.group({
      nombre: ['', [Validators.required, Validators.minLength(2)]],
      especialidad: ['', Validators.required],
      telefono: ['', [Validators.required, Validators.pattern(/^\d{7,15}$/)]],
      correo: ['', [Validators.required, Validators.email]],
      registro: [''] 
      
    });
  }

  submit(): void {
    if (this.form.valid) {
      this.loading = true;
      const payload = this.form.value;

      this.medicoService.createMedico(payload).subscribe({
        next: () => {
          this.messageService.add({
            severity: 'success',
            summary: 'Éxito',
            detail: 'Médico creado correctamente'
          });
          setTimeout(() => {
            
            this.router.navigate(['/doctors/show']);
          }, 800);
        },
        error: (error) => {
          console.error('Error creating doctor:', error);
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: error?.error?.error || 'Error al crear el médico'
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
    
    this.router.navigate(['/doctors/show']);
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
        if (fieldName === 'telefono') return 'Teléfono debe tener entre 7 y 15 dígitos';
        return 'Formato no válido';
      }
    }
    return '';
  }

  
  get f() {
    return this.form.controls;
  }
}
