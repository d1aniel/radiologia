import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';

// PrimeNG (rutas correctas en v20)
import { InputTextModule } from 'primeng/inputtext';
import { SelectModule } from 'primeng/select';
import { ButtonModule } from 'primeng/button';
import { InputMaskModule } from 'primeng/inputmask';

type StatusType = 'ACTIVE' | 'INACTIVE';

@Component({
  selector: 'app-createpatient',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule,
    InputTextModule,
    SelectModule,
    ButtonModule,
    InputMaskModule
  ],
  templateUrl: './createpatients.html',
  styleUrls: ['./createpatients.css']
})
export class Createpatients {
  private fb = inject(FormBuilder);
  private router = inject(Router);

  tiposDocumento = [
    { label: 'Cédula', value: 'cedula' },
    { label: 'Tarjeta de Identidad', value: 'tarjeta' },
    { label: 'Pasaporte', value: 'pasaporte' }
  ];

  epsOptions = [
    { label: 'Sanitas', value: 'sanitas' },
    { label: 'Sura', value: 'sura' },
    { label: 'Nueva EPS', value: 'nueva_eps' },
    { label: 'Compensar', value: 'compensar' },
    { label: 'Otra', value: 'otra' }
  ];

  statusOptions: { label: string; value: StatusType }[] = [
    { label: 'Activo', value: 'ACTIVE' },
    { label: 'Inactivo', value: 'INACTIVE' }
  ];

  form: FormGroup = this.fb.group({
    nombre: ['', [Validators.required, Validators.minLength(2)]],
    apellido: ['', [Validators.required, Validators.minLength(2)]],
    tpdocumento: ['cedula', [Validators.required]],
    documento: ['', [Validators.required, Validators.pattern(/^\d{6,15}$/)]],
    telefono: ['', [Validators.required, Validators.pattern(/^\d{7,15}$/)]],
    eps: ['', [Validators.required]],
    correo: ['', [Validators.required, Validators.email]],
    status: ['ACTIVE' as StatusType, [Validators.required]]
  });

  get f() { return this.form.controls; }

  onSubmit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    const payload = this.form.value;
    // TODO: reemplaza por tu servicio real:
    // this.patientsService.create(payload).subscribe(() => this.router.navigate(['/patients']));
    console.log('Paciente a guardar:', payload);
    this.router.navigate(['/patients']);
  }

  onCancel() {
    this.router.navigate(['/patients']);
  }
}
