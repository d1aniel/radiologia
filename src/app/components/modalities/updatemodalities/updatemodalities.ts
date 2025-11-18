// src/app/components/modalities/editmodalities/editmodalities.ts
import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { TextareaModule } from 'primeng/textarea';
import { ToggleSwitchModule } from 'primeng/toggleswitch';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';

import { ModalidadService } from '../../../services/modaliti'; // ajusta nombre si es distinto
import { ModalidadI } from '../../../models/modalities';

@Component({
  selector: 'app-edit-modalidad',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    ButtonModule,
    InputTextModule,
    TextareaModule,
    ToggleSwitchModule,
    ToastModule
  ],
  templateUrl: './updatemodalities.html',
  styleUrls: ['./updatemodalities.css'],
  providers: [MessageService]
})
export class Updatemodalities implements OnInit {
  form: FormGroup;
  loading = false;
  modalidadId!: number;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private modalidadService: ModalidadService,
    private messageService: MessageService
  ) {
    this.form = this.fb.group({
      nombre: ['', [Validators.required, Validators.minLength(2)]],
      descripcion: ['', [Validators.required, Validators.minLength(5)]],
      activa: [true, [Validators.required]]
    });
  }

  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('id');
    this.modalidadId = Number(idParam);

    if (!this.modalidadId) {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'ID de modalidad inválido'
      });
      this.router.navigate(['/modalities/show']);
      return;
    }

    this.cargarModalidad();
  }

  private cargarModalidad(): void {
    this.loading = true;
    this.modalidadService.getModalidadById(this.modalidadId).subscribe({
      next: (modalidad: ModalidadI) => {
        this.form.patchValue({
          nombre: modalidad.nombre,
          descripcion: modalidad.descripcion,
          activa: modalidad.activa
        });
        this.loading = false;
      },
      error: (err) => {
        console.error('Error cargando modalidad', err);
        this.loading = false;
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'No se pudo cargar la modalidad'
        });
        this.router.navigate(['/modalities/show']);
      }
    });
  }

  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.loading = true;
    const payload: Partial<ModalidadI> = this.form.value;

    this.modalidadService.updateModalidad(this.modalidadId, payload).subscribe({
      next: () => {
        this.loading = false;
        this.messageService.add({
          severity: 'success',
          summary: 'Éxito',
          detail: 'Modalidad actualizada correctamente'
        });
        this.router.navigate(['/modalities/show']);
      },
      error: (err) => {
        console.error('Error actualizando modalidad', err);
        this.loading = false;
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'No se pudo actualizar la modalidad'
        });
      }
    });
  }

  cancelar(): void {
    this.router.navigate(['/modalities/show']);
  }
}
