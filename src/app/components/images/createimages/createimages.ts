
import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';

import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { Select } from 'primeng/select';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';

import { ImageService } from '../../../services/image';
import { StudyService } from '../../../services/studie';
import { StudyReadI } from '../../../models/studies';
import { TipoImagen } from '../../../models/images';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-create-image',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule,
    InputTextModule,
    ButtonModule,
    Select,
    ToastModule
  ],
  templateUrl: './createimages.html',
  styleUrls: ['./createimages.css'],
  providers: [MessageService]
})
export class Createimages implements OnInit, OnDestroy {
  form: FormGroup;
  loading = false;

  tiposImagen = [
    { label: 'DICOM', value: 'DICOM' as TipoImagen },
    { label: 'JPG',   value: 'JPG'   as TipoImagen },
    { label: 'PNG',   value: 'PNG'   as TipoImagen },
    { label: 'Serie', value: 'Serie' as TipoImagen },
  ];

  estudios: { label: string; value: number }[] = [];

  private selectedFile: File | null = null;
  private blobUrl: string | null = null;
  private subs = new Subscription();

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private imagesService: ImageService,
    private studiesService: StudyService,
    private messageService: MessageService
  ) {
    this.form = this.fb.group({
      estudioId: [null, Validators.required],
      tipo: ['DICOM', Validators.required],
      
      nombreArchivo: [{ value: '', disabled: true }, Validators.required],
      tamanoBytes: [{ value: '', disabled: true }, Validators.required],
      serie: [''],
      orden: [null, [Validators.min(0)]],
      
      fileCtl: [null, Validators.required]
    });
  }

  ngOnInit(): void {
    
    const s = this.studiesService.getAll().subscribe({
      next: ({ studies }) => {
        this.estudios = (studies ?? []).map((st: StudyReadI) => ({
          label: this.formatStudyLabel(st),
          value: st.id
        }));
      },
      error: () => {
        this.estudios = [];
        this.messageService.add({
          severity: 'warn',
          summary: 'Advertencia',
          detail: 'No se pudieron cargar los estudios'
        });
      }
    });
    this.subs.add(s);

    
    const s2 = this.form.get('tipo')!.valueChanges.subscribe((tipo: TipoImagen) => {
      const serieCtl = this.form.get('serie')!;
      if (tipo === 'Serie') {
        serieCtl.addValidators([Validators.required]);
      } else {
        serieCtl.clearValidators();
      }
      serieCtl.updateValueAndValidity({ emitEvent: false });
    });
    this.subs.add(s2);
  }

  ngOnDestroy(): void {
    if (this.blobUrl) URL.revokeObjectURL(this.blobUrl);
    this.subs.unsubscribe();
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
        tamanoBytes: file.size,
        fileCtl: 'ok'
      });
      this.f['nombreArchivo'].enable({ emitEvent: false });
      this.f['tamanoBytes'].enable({ emitEvent: false });
    } else {
      this.form.patchValue({ nombreArchivo: '', tamanoBytes: '', fileCtl: null });
      this.f['nombreArchivo'].disable({ emitEvent: false });
      this.f['tamanoBytes'].disable({ emitEvent: false });
    }
  }

  submit(): void {
    if (!this.selectedFile) {
      this.form.markAllAsTouched();
      this.messageService.add({
        severity: 'warn',
        summary: 'Archivo requerido',
        detail: 'Debes seleccionar un archivo de imagen'
      });
      return;
    }

    if (this.form.invalid) {
      this.form.markAllAsTouched();
      this.messageService.add({
        severity: 'warn',
        summary: 'Campos incompletos',
        detail: 'Por favor completa los campos requeridos'
      });
      return;
    }

    const v = this.form.getRawValue();
    this.loading = true;

    
    const formData = new FormData();
    formData.append('file', this.selectedFile);
    formData.append('estudioId', String(v.estudioId));
    formData.append('tipo', v.tipo);
    if (v.serie) formData.append('serie', v.serie);
    if (v.orden != null) formData.append('orden', String(v.orden));

    this.imagesService.createImage(formData).subscribe({
      next: () => {
        this.messageService.add({
          severity: 'success',
          summary: 'Éxito',
          detail: 'Imagen subida correctamente'
        });
        setTimeout(() => {
          this.router.navigate(['/images/show']); 
        }, 700);
      },
      error: (err) => {
        console.error('Error creating image:', err);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: err?.error?.error || 'No se pudo subir la imagen'
        });
        this.loading = false;
      }
    });
  }

  cancelar(): void {
    this.router.navigate(['/images/show']); 
  }

  getFieldError(fieldName: string): string {
    const field = this.form.get(fieldName);
    if (field?.errors && field?.touched) {
      if (field.errors['required']) {
        if (fieldName === 'fileCtl') return 'Debes seleccionar un archivo';
        if (fieldName === 'serie') return 'La serie es requerida para tipo "Serie"';
        return `${fieldName} es requerido`;
      }
      if (field.errors['min']) {
        return `${fieldName} debe ser un número positivo`;
      }
    }
    return '';
  }

  private formatStudyLabel(study: StudyReadI): string {
    const patientName = study.patient
      ? [study.patient.nombre, study.patient.apellido].filter(Boolean).join(' ').trim()
      : `Paciente #${study.patient_id}`;
    const modality = study.modalidad_obj?.nombre ?? 'N/A';
    const team = study.team_obj?.nombre ?? 'N/A';
    return `${patientName || 'Paciente'} — ${modality} — ${team}`;
  }
}
