
import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { Select } from 'primeng/select';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';

import { TechnologistService } from '../../../services/technologist';
import { TecnologoI } from '../../../models/technologists';

@Component({
  selector: 'app-edit-technologists',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    ButtonModule,
    InputTextModule,
    Select,
    ToastModule
  ],
  templateUrl: './updatetechnologists.html',
  styleUrls: ['./updatetechnologists.css'],
  providers: [MessageService]
})
export class Updatetechnologists implements OnInit {
  form: FormGroup;
  loading = false;
  technologistId!: number;

  
  statusOptions = [
    { label: 'Activo', value: 'ACTIVE' },
    { label: 'Inactivo', value: 'INACTIVE' }
  ];

  
  especialidadOptions = [
    { label: 'Rayos X', value: 'RX' },
    { label: 'Tomografía (TAC)', value: 'TAC' },
    { label: 'Resonancia (RM)', value: 'RM' }
  ];

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private technologistService: TechnologistService,
    private messageService: MessageService
  ) {
    
    this.form = this.fb.group({
      nombre: ['', [Validators.required]],
      especialidad: ['', [Validators.required]],
      telefono: ['', [Validators.required]],
      correo: ['', [Validators.email]],
      status: ['', [Validators.required]]
    });
  }

  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('id');
    this.technologistId = Number(idParam);

    if (!this.technologistId) {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'ID de tecnólogo inválido'
      });
      this.router.navigate(['/technologists/show']);
      return;
    }

    this.cargarTechnologist();
  }

  private cargarTechnologist(): void {
    this.loading = true;
    this.technologistService.getTechnologistById(this.technologistId).subscribe({
      next: (tec: TecnologoI) => {
        this.form.patchValue({
          nombre: tec.nombre,
          especialidad: tec.especialidad,
          telefono: tec.telefono,
          correo: tec.correo,
          status: tec.status
        });
        this.loading = false;
      },
      error: (err) => {
        console.error('Error cargando tecnólogo', err);
        this.loading = false;
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'No se pudo cargar el tecnólogo'
        });
        this.router.navigate(['/technologists/show']);
      }
    });
  }

  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.loading = true;
    const payload: Partial<TecnologoI> = this.form.value;

    this.technologistService.updateTechnologist(this.technologistId, payload).subscribe({
      next: () => {
        this.loading = false;
        this.messageService.add({
          severity: 'success',
          summary: 'Éxito',
          detail: 'Tecnólogo actualizado correctamente'
        });
        this.router.navigate(['/technologists/show']);
      },
      error: (err) => {
        console.error('Error actualizando tecnólogo', err);
        this.loading = false;
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'No se pudo actualizar el tecnólogo'
        });
      }
    });
  }

  cancelar(): void {
    this.router.navigate(['/technologists/show']);
  }
}
