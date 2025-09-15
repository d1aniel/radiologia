// src/app/features/images/createimage.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';

import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { SelectModule } from 'primeng/select';

import { ImagesService } from '../../../services/image';
import { StudiesService } from '../../../services/studie';
import { TipoImagen } from '../../../models/images';

@Component({
  selector: 'app-create-image',
  standalone: true,
  imports: [
    CommonModule, ReactiveFormsModule, RouterModule,
    InputTextModule, ButtonModule, SelectModule
  ],
  templateUrl: './createimages.html'
})
export class Createimages implements OnInit {
  form: FormGroup;

  tiposImagen = [
    { label: 'DICOM', value: 'DICOM' as TipoImagen },
    { label: 'JPG',   value: 'JPG'   as TipoImagen },
    { label: 'PNG',   value: 'PNG'   as TipoImagen },
    { label: 'Serie', value: 'Serie' as TipoImagen },
  ];

  estudios: { label: string; value: number }[] = [];

  private selectedFile: File | null = null;
  private blobUrl: string | null = null;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private imagesService: ImagesService,
    private studiesService: StudiesService
  ) {
    this.form = this.fb.group({
      estudioId: [null, Validators.required],
      tipo: ['DICOM', Validators.required],
      nombreArchivo: [{ value: '', disabled: true }, Validators.required],
      tamanoBytes: [{ value: '', disabled: true }, Validators.required],
      serie: [''],
      orden: [null, [Validators.min(0)]],
    });
  }

  ngOnInit(): void {
    // Inicializamos las opciones del select de estudios cuando el servicio ya está listo
    this.estudios = this.studiesService.getAll().map(s => ({
      label: `${s.paciente} — ${s.modalidad} — ${s.equipo}`,
      value: s.id
    }));
  }

  get f() { return this.form.controls; }

  onFileChange(ev: Event): void {
    const input = ev.target as HTMLInputElement;
    const file = input.files?.[0] ?? null;
    this.selectedFile = file;

    if (this.blobUrl) {
      URL.revokeObjectURL(this.blobUrl);
      this.blobUrl = null;
    }

    if (file) {
      this.blobUrl = URL.createObjectURL(file);
      this.form.patchValue({
        nombreArchivo: file.name,
        tamanoBytes: file.size
      });
      this.f['nombreArchivo'].enable({ emitEvent: false });
      this.f['tamanoBytes'].enable({ emitEvent: false });
    } else {
      this.form.patchValue({ nombreArchivo: '', tamanoBytes: '' });
      this.f['nombreArchivo'].disable({ emitEvent: false });
      this.f['tamanoBytes'].disable({ emitEvent: false });
    }
  }

  onSubmit(): void {
    if (!this.selectedFile) {
      this.form.markAllAsTouched();
      alert('Debes seleccionar un archivo.');
      return;
    }

    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const v = this.form.getRawValue();
    this.imagesService.addImage({
      estudioId: v.estudioId,
      tipo: v.tipo,
      url: this.blobUrl!, // En backend real: URL que devuelva el servidor tras subir el archivo
      nombreArchivo: v.nombreArchivo,
      tamanoBytes: Number(v.tamanoBytes),
      serie: v.serie || null,
      orden: v.orden != null ? Number(v.orden) : null,
    });

    this.router.navigate(['/images/show']);
  }

  onCancel(): void {
    this.router.navigate(['/images/show']);
  }
}
