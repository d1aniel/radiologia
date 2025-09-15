// src/app/features/informes/createinforme.ts
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { SelectModule } from 'primeng/select';
import { InformeService } from '../../../services/report';
import { InformeEstado } from '../../../models/reports';

type OptionNum = { label: string; value: number };
type OptionStr = { label: string; value: InformeEstado };

@Component({
  selector: 'app-create-informe',
  standalone: true,
  imports: [
    CommonModule, ReactiveFormsModule, RouterModule,
    InputTextModule, ButtonModule, SelectModule
  ],
  templateUrl: './createreports.html'
})
export class Createreports {
  form: FormGroup;

  // Reemplaza estos catálogos por tus services reales (StudiesService, DoctorsService)
  estudiosOptions: OptionNum[] = [
    { label: 'Estudio #1 – RX Tórax', value: 1 },
    { label: 'Estudio #2 – TAC Abdomen', value: 2 },
  ];

  medicosOptions: OptionNum[] = [
    { label: 'Dr. Juan Pérez', value: 1 },
    { label: 'Dra. Ana Gómez', value: 2 },
  ];

  estadoOptions: OptionStr[] = [
    { label: 'Borrador', value: 'BORRADOR' },
    { label: 'Firmado',  value: 'FIRMADO' },
  ];

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private informeService: InformeService
  ) {
    this.form = this.fb.group({
      estudioId: [null, Validators.required],
      medicoId:  [null, Validators.required],
      estado:    ['BORRADOR' as InformeEstado, Validators.required],
      cuerpo:    ['', [Validators.required, Validators.minLength(10)]],
    });
  }

  get f() { return this.form.controls; }

  onSubmit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const { estudioId } = this.form.value;
    // Enforce 1:1 (un estudio no puede tener 2 informes)
    const yaTiene = this.informeService.getByEstudioId(estudioId);
    if (yaTiene) {
      alert('Este estudio ya tiene un informe. Selecciona otro.');
      return;
    }

    this.informeService.addInforme({
      ...this.form.value
      // el service setea id y fechaCreacion
    });

    this.router.navigate(['/informes/show']);
  }

  onCancel() {
    this.router.navigate(['/informes/show']);
  }
}
