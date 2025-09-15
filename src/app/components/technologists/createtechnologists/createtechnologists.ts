import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { SelectModule } from 'primeng/select';
import { TecnologosService } from '../../../services/technologist';

@Component({
  selector: 'app-create-tecnologo',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule, InputTextModule, ButtonModule, SelectModule],
  templateUrl: './createtechnologists.html'
})
export class Createtechnologists {
  form: FormGroup;

  constructor(private fb: FormBuilder, private router: Router, private tecnologosService: TecnologosService) {
    this.form = this.fb.group({
      nombre: ['', [Validators.required, Validators.minLength(2)]],
      especialidad: ['', Validators.required], // RX/TAC/RM
      telefono: ['', [Validators.required, Validators.pattern(/^\d{7,15}$/)]],
      correo: ['', [Validators.required, Validators.email]]
    });
  }

  get f() { return this.form.controls; }

  onSubmit() {
    if (this.form.invalid) { this.form.markAllAsTouched(); return; }
    this.tecnologosService.addTecnologo({ ...this.form.value, status: 'ACTIVATE' });
    this.router.navigate(['/tecnologos/show']);
  }

  onCancel() { this.router.navigate(['/tecnologos/show']); }
}
