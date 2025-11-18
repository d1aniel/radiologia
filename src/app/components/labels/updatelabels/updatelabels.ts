
import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { Select } from 'primeng/select';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';

import { LabelService } from '../../../services/label';
import { LabelsI } from '../../../models/labels';

@Component({
  selector: 'app-edit-labels',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    ButtonModule,
    InputTextModule,
    Select,
    ToastModule
  ],
  templateUrl: './updatelabels.html',
  styleUrls: ['./updatelabels.css'],
  providers: [MessageService]
})
export class Updatelabels implements OnInit {
  form: FormGroup;
  loading = false;
  labelId!: number;

  statusOptions = [
    { label: 'Activo', value: 'ACTIVATE' },
    { label: 'Inactivo', value: 'INACTIVE' }
  ];

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private labelService: LabelService,
    private messageService: MessageService
  ) {
    this.form = this.fb.group({
      nombre: ['', [Validators.required, Validators.minLength(2)]],
      descripcion: ['', [Validators.maxLength(255)]],
      status: ['', [Validators.required]]
    });
  }

  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('id');
    this.labelId = Number(idParam);

    if (!this.labelId) {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'ID de etiqueta inválido'
      });
      this.router.navigate(['/labels/show']);
      return;
    }

    this.cargarEtiqueta();
  }

  private cargarEtiqueta(): void {
    this.loading = true;
    this.labelService.getLabelById(this.labelId).subscribe({
      next: (label: LabelsI) => {
        this.form.patchValue({
          nombre: label.nombre,
          descripcion: label.descripcion,
          status: label.status
        });
        this.loading = false;
      },
      error: (err) => {
        console.error('Error cargando etiqueta', err);
        this.loading = false;
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'No se pudo cargar la etiqueta'
        });
        this.router.navigate(['/labels/show']);
      }
    });
  }

  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.loading = true;
    const payload: Partial<LabelsI> = this.form.value;

    this.labelService.updateLabel(this.labelId, payload).subscribe({
      next: () => {
        this.loading = false;
        this.messageService.add({
          severity: 'success',
          summary: 'Éxito',
          detail: 'Etiqueta actualizada correctamente'
        });
        this.router.navigate(['/labels/show']);
      },
      error: (err) => {
        console.error('Error actualizando etiqueta', err);
        this.loading = false;
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'No se pudo actualizar la etiqueta'
        });
      }
    });
  }

  cancelar(): void {
    this.router.navigate(['/labels/show']);
  }
}
