import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';

import { InputTextModule } from 'primeng/inputtext';
import { TextareaModule } from 'primeng/textarea';
import { ToggleSwitchModule } from 'primeng/toggleswitch';
import { ButtonModule } from 'primeng/button';

import { ModalidadService } from '../../../services/modaliti';

@Component({
  selector: 'app-createmodalidad',
  standalone: true,
  imports: [
    CommonModule, ReactiveFormsModule, RouterModule,
    InputTextModule, TextareaModule, ToggleSwitchModule, ButtonModule
  ],
  templateUrl: './createmodalities.html',
  styleUrls: ['./createmodalities.css']
})
export class Createmodalities {
  private fb = inject(FormBuilder);
  private router = inject(Router);
  private service = inject(ModalidadService);

  form = this.fb.group({
    nombre: ['', [Validators.required, Validators.minLength(2)]],
    descripcion: ['', [Validators.required, Validators.minLength(5)]],
    activa: [true, Validators.required]
  });

  get f() { return this.form.controls; }

  onSubmit() {
    if (this.form.invalid) { this.form.markAllAsTouched(); return; }

    const v = this.form.value;
    this.service.add({
      nombre: v.nombre!,
      descripcion: v.descripcion!,
      activa: !!v.activa
    });

    this.router.navigate(['/modalidad/show']);
  }

  onCancel() {
    this.router.navigate(['/modalidad/show']);
  }
}
