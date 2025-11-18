
import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { Select } from 'primeng/select';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';


import { LabelService } from '../../../services/label';

@Component({
  selector: 'app-create-labels',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, ButtonModule, InputTextModule, Select, ToastModule],
  templateUrl: './createlabels.html',
  styleUrls: ['./createlabels.css'],
  providers: [MessageService]
})
export class Createlabels {
  form: FormGroup;
  loading = false;

  statusOptions = [
    { label: 'Activo', value: 'ACTIVATE' },
    { label: 'Inactivo', value: 'INACTIVE' }
  ];

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private labelService: LabelService,
    private messageService: MessageService
  ) {
    this.form = this.fb.group({
      nombre: ['', [Validators.required, Validators.minLength(2)]],
      descripcion: ['', [Validators.maxLength(255)]],
      status: ['ACTIVATE', Validators.required]
    });
  }

  submit(): void {
    if (this.form.valid) {
      this.loading = true;
      const payload = this.form.value; 

      this.labelService.createLabel(payload).subscribe({
        next: () => {
          this.messageService.add({
            severity: 'success',
            summary: 'Éxito',
            detail: 'Etiqueta creada correctamente'
          });
          setTimeout(() => {
            
            this.router.navigate(['/labels/show']);
          }, 800);
        },
        error: (error) => {
          console.error('Error creating label:', error);
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: error?.error?.error || 'Error al crear la etiqueta'
          });
          this.loading = false;
        }
      });
    } else {
      this.markFormGroupTouched();
      this.messageService.add({
        severity: 'warn',
        summary: 'Advertencia',
        detail: 'Por favor complete los campos requeridos'
      });
    }
  }

  cancelar(): void {
    this.router.navigate(['/labels/show']);
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
      if (field.errors['minlength']) {
        return `${fieldName} debe tener al menos ${field.errors['minlength'].requiredLength} caracteres`;
      }
      if (field.errors['maxlength']) {
        return `${fieldName} no puede exceder ${field.errors['maxlength'].requiredLength} caracteres`;
      }
    }
    return '';
  }
}
