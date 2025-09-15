import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';

import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';

import { TagsService } from '../../../services/label';

@Component({
  selector: 'app-create-tags',
  standalone: true,
  imports: [
    CommonModule, ReactiveFormsModule, RouterModule,
    InputTextModule, ButtonModule
  ],
  templateUrl: './createlabels.html'
})
export class Createlabels {
  form: FormGroup;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private tagsService: TagsService
  ) {
    this.form = this.fb.group({
      nombre: ['', [Validators.required, Validators.minLength(2)]],
      descripcion: ['']
      // status eliminado del form
    });
  }

  get f() { return this.form.controls; }

  onSubmit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    // Forzamos que la etiqueta quede activa al crear
    this.tagsService.addTag({
      ...this.form.value,
      status: 'ACTIVATE'
    });
    this.router.navigate(['/labels/show']);
  }

  onCancel() {
    this.router.navigate(['/labels/show']);
  }
}
