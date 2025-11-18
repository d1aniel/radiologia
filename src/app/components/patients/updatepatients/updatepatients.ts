// src/app/components/patients/editpatients/editpatients.ts
import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { Select } from 'primeng/select';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';

import { PatientService } from '../../../services/patient';
import { PacientsI } from '../../../models/pacients';

@Component({
  selector: 'app-edit-patients',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    ButtonModule,
    InputTextModule,
    Select,
    ToastModule
  ],
  templateUrl: './updatepatients.html',
  styleUrls: ['./updatepatients.css'],
  providers: [MessageService]
})
export class Updatepatients implements OnInit {
  form: FormGroup;
  loading = false;
  patientId!: number;

  // ⚠️ Usa las mismas opciones que en Createpatients
  statusOptions = [
    { label: 'Activo', value: 'ACTIVATE' },
    { label: 'Inactivo', value: 'INACTIVE' }
  ];

  sexoOptions = [
    { label: 'Masculino', value: 'M' },
    { label: 'Femenino', value: 'F' },
    { label: 'Otro', value: 'O' }
  ];

  tpDocOptions = [
    { label: 'Cédula de ciudadanía', value: 'CC' },
    { label: 'Tarjeta de identidad', value: 'TI' },
    { label: 'Cédula de extranjería', value: 'CE' },
    { label: 'Registro civil', value: 'RC' }
  ];

  // Ajusta según tu dominio real
  epsOptions = [
    { label: 'Sura', value: 'SURA' },
    { label: 'Nueva EPS', value: 'NUEVA_EPS' },
    { label: 'Sanitas', value: 'SANITAS' },
    { label: 'Otra', value: 'OTRA' }
  ];

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private patientsService: PatientService,
    private messageService: MessageService
  ) {
    // ⚙️ Mismos campos que en createpatients
    this.form = this.fb.group({
      nombre: ['', [Validators.required]],
      apellido: ['', [Validators.required]],
      tpdocumento: ['', [Validators.required]],
      documento: ['', [Validators.required]],
      sexo: ['', [Validators.required]],
      telefono: ['', [Validators.required]],
      eps: ['', [Validators.required]],
      correo: ['', [Validators.email]],
      status: ['', [Validators.required]]
    });
  }

  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('id');
    this.patientId = Number(idParam);

    if (!this.patientId) {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'ID de paciente inválido'
      });
      this.router.navigate(['/patients']);
      return;
    }

    this.cargarPaciente();
  }

  private cargarPaciente(): void {
    this.loading = true;
    this.patientsService.getPatientById(this.patientId).subscribe({
      next: (pacient: PacientsI) => {
        // Rellena el formulario con lo que viene del backend
        this.form.patchValue({
          nombre: pacient.nombre,
          apellido: pacient.apellido,
          tpdocumento: pacient.tpdocumento,
          documento: pacient.documento,
          sexo: pacient.sexo,
          telefono: pacient.telefono,
          eps: pacient.eps,
          correo: pacient.correo,
          status: pacient.status
        });
        this.loading = false;
      },
      error: (err) => {
        console.error('Error cargando paciente', err);
        this.loading = false;
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'No se pudo cargar el paciente'
        });
        this.router.navigate(['/patients/show']);
      }
    });
  }

  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.loading = true;
    const payload: Partial<PacientsI> = this.form.value;

    this.patientsService.updatePatient(this.patientId, payload).subscribe({
      next: () => {
        this.loading = false;
        this.messageService.add({
          severity: 'success',
          summary: 'Éxito',
          detail: 'Paciente actualizado correctamente'
        });
        this.router.navigate(['/patients/show']);
      },
      error: (err) => {
        console.error('Error actualizando paciente', err);
        this.loading = false;
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'No se pudo actualizar el paciente'
        });
      }
    });
  }

  cancelar(): void {
    this.router.navigate(['/patients/show']);
  }
}
