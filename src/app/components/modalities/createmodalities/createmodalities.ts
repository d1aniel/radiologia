// src/app/components/modalities/createmodalities/createmodalities.ts
import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';

import { InputTextModule } from 'primeng/inputtext';
import { TextareaModule } from 'primeng/textarea';
import { ToggleSwitchModule } from 'primeng/toggleswitch';
import { ButtonModule } from 'primeng/button';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';

import { ModalidadService } from '../../../services/modaliti'; // 👈 ajusta si tu archivo se llama distinto

@Component({
  selector: 'app-createmodalidad',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule,
    InputTextModule,
    TextareaModule,
    ToggleSwitchModule,
    ButtonModule,
    ToastModule
  ],
  templateUrl: './createmodalities.html',
  styleUrls: ['./createmodalities.css'],
  providers: [MessageService]
})
export class Createmodalities {
  private fb = inject(FormBuilder);
  private router = inject(Router);
  private service = inject(ModalidadService);
  private messageService = inject(MessageService);

  loading = false;

  form = this.fb.group({
    nombre: ['', [Validators.required, Validators.minLength(2)]],
    descripcion: ['', [Validators.required, Validators.minLength(5)]],
    activa: [true, Validators.required]
  });

  get f() {
    return this.form.controls;
  }

  onSubmit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      this.messageService.add({
        severity: 'warn',
        summary: 'Advertencia',
        detail: 'Por favor complete todos los campos requeridos'
      });
      return;
    }

    this.loading = true;

    const v = this.form.value;
    const payload = {
      nombre: v.nombre!,
      descripcion: v.descripcion!,
      activa: !!v.activa
    };

    this.service.createModalidad(payload).subscribe({
      next: () => {
        this.messageService.add({
          severity: 'success',
          summary: 'Éxito',
          detail: 'Modalidad creada correctamente'
        });

        setTimeout(() => {
          this.router.navigate(['/modalities/show']);
        }, 800);
      },
      error: (error) => {
        console.error('Error creating modalidad:', error);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: error?.error?.error || 'Error al crear la modalidad'
        });
        this.loading = false;
      }
    });
  }

  onCancel() {
    this.router.navigate(['/modalities/show']);
  }
}
