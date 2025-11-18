// src/app/components/doctors/updatedoctors/updatedoctors.ts
import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { Select } from 'primeng/select';        // 👈 IGUAL QUE EN patients
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';

import { MedicoService } from '../../../services/doctor';
import { MedicoI } from '../../../models/doctors';

@Component({
  selector: 'app-update-doctors',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    ButtonModule,
    InputTextModule,
    Select,          // 👈 IMPORT CORRECTO
    ToastModule
  ],
  templateUrl: './updatedoctors.html',
  styleUrls: ['./updatedoctors.css'],
  providers: [MessageService]
})
export class Updatedoctors implements OnInit {
  form: FormGroup;
  loading = false;
  doctorId!: number;

  especialidades = [
    { label: 'Radiología General', value: 'Radiología General' },
    { label: 'Neurorradiología', value: 'Neurorradiología' },
    { label: 'MSK (Musculoesquelética)', value: 'MSK (Musculoesquelética)' },
    { label: 'Pediátrica', value: 'Pediátrica' },
    { label: 'Intervencionista', value: 'Intervencionista' }
  ];

  statusOptions = [
    { label: 'Activo', value: 'ACTIVATE' },
    { label: 'Inactivo', value: 'INACTIVE' }
  ];

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private medicoService: MedicoService,   // 👈 asegúrate que este servicio exista
    private messageService: MessageService
  ) {
    this.form = this.fb.group({
      nombre: ['', [Validators.required, Validators.minLength(2)]],
      especialidad: ['', [Validators.required]],
      // permitimos + y espacios para cosas como "+57 3001234567"
      telefono: ['', [Validators.required, Validators.pattern(/^[0-9+\s]{7,20}$/)]],
      correo: ['', [Validators.required, Validators.email]],
      registro: [''],
      status: ['ACTIVATE', [Validators.required]]
    });
  }

  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('id');
    this.doctorId = Number(idParam);

    if (!this.doctorId) {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'ID de médico inválido'
      });
      this.router.navigate(['/doctors/show']);
      return;
    }

    this.cargarDoctor();
  }

  private cargarDoctor(): void {
    this.loading = true;

    this.medicoService.getMedicoById(this.doctorId).subscribe({
      next: (medico: MedicoI) => {
        this.form.patchValue({
          nombre: medico.nombre,
          especialidad: medico.especialidad,
          telefono: medico.telefono,        // aquí ya viene "+57 3..."
          correo: medico.correo,
          registro: medico.registro || '',
          status: medico.status
        });
        this.loading = false;
      },
      error: (err) => {
        console.error('Error cargando médico', err);
        this.loading = false;
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'No se pudo cargar el médico'
        });
        this.router.navigate(['/doctors/show']);
      }
    });
  }

  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.loading = true;
    const payload: Partial<MedicoI> = this.form.value;

    this.medicoService.updateMedico(this.doctorId, payload).subscribe({
      next: () => {
        this.loading = false;
        this.messageService.add({
          severity: 'success',
          summary: 'Éxito',
          detail: 'Médico actualizado correctamente'
        });
        this.router.navigate(['/doctors/show']);
      },
      error: (err) => {
        console.error('Error actualizando médico', err);
        this.loading = false;
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'No se pudo actualizar el médico'
        });
      }
    });
  }

  cancelar(): void {
    this.router.navigate(['/doctors/show']);
  }
}
