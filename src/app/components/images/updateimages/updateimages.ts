// src/app/components/images/editimages/editimages.ts
import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';

import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { Select } from 'primeng/select';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';

import { ImageService } from '../../../services/image';
import { StudyService } from '../../../services/studie';
import { ImageI, TipoImagen } from '../../../models/images';
import { StudyReadI } from '../../../models/studies';

@Component({
  selector: 'app-edit-images',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule,
    ButtonModule,
    InputTextModule,
    Select,
    ToastModule
  ],
  templateUrl: './updateimages.html',
  styleUrls: ['./updateimages.css'],
  providers: [MessageService]
})
export class Updateimages implements OnInit {
  form: FormGroup;
  loading = false;
  imageId!: number;

  tiposImagen = [
    { label: 'DICOM', value: 'DICOM' as TipoImagen },
    { label: 'JPG',   value: 'JPG'   as TipoImagen },
    { label: 'PNG',   value: 'PNG'   as TipoImagen },
    { label: 'Serie', value: 'Serie' as TipoImagen },
  ];

  estudios: { label: string; value: number }[] = [];

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private imageService: ImageService,
    private studiesService: StudyService,
    private messageService: MessageService
  ) {
    // Campos a editar / mostrar (NO cambiamos archivo aquí)
    this.form = this.fb.group({
      estudioId: [null, Validators.required],
      tipo: ['', Validators.required],
      // solo lectura (info actual del archivo)
      nombreArchivo: [{ value: '', disabled: true }],
      tamanoBytes: [{ value: '', disabled: true }],
      url: [{ value: '', disabled: true }],
      // editables
      serie: [''],
      orden: [null, [Validators.min(0)]],
    });
  }

  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('id');
    this.imageId = Number(idParam);

    if (!this.imageId) {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'ID de imagen inválido'
      });
      this.router.navigate(['/images']);
      return;
    }

    // Cargar estudios para el select
    this.cargarEstudios();

    // Validación dinámica de serie cuando tipo = 'Serie'
    this.form.get('tipo')!.valueChanges.subscribe((tipo: TipoImagen) => {
      const serieCtl = this.form.get('serie')!;
      if (tipo === 'Serie') {
        serieCtl.addValidators([Validators.required]);
      } else {
        serieCtl.clearValidators();
      }
      serieCtl.updateValueAndValidity({ emitEvent: false });
    });

    // Cargar datos de la imagen
    this.cargarImagen();
  }

  get f() { return this.form.controls; }

  private cargarEstudios(): void {
    this.studiesService.getAll().subscribe({
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
  }

  private cargarImagen(): void {
    this.loading = true;
    this.imageService.getImageById(this.imageId).subscribe({
      next: (img: ImageI) => {
        this.form.patchValue({
          estudioId: img.estudioId,
          tipo: img.tipo,
          nombreArchivo: img.nombreArchivo,
          tamanoBytes: img.tamanoBytes,
          url: img.url,
          serie: img.serie ?? '',
          orden: img.orden ?? null,
        });
        this.loading = false;
      },
      error: (err) => {
        console.error('Error cargando imagen', err);
        this.loading = false;
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'No se pudo cargar la imagen'
        });
        this.router.navigate(['/images']);
      }
    });
  }

  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.loading = true;
    const v = this.form.getRawValue();

    const payload: Partial<ImageI> = {
      estudioId: v.estudioId,
      tipo: v.tipo,
      serie: v.serie || null,
      orden: v.orden != null ? Number(v.orden) : null,
      // NO tocamos archivo ni url salvo que quieras permitir editar manualmente
      // nombreArchivo: v.nombreArchivo,
      // tamanoBytes: v.tamanoBytes,
      // url: v.url,
    };

    this.imageService.updateImage(this.imageId, payload).subscribe({
      next: () => {
        this.loading = false;
        this.messageService.add({
          severity: 'success',
          summary: 'Éxito',
          detail: 'Imagen actualizada correctamente'
        });
        this.router.navigate(['/images/show']); // ajusta si tu listado es /images/show
      },
      error: (err) => {
        console.error('Error actualizando imagen', err);
        this.loading = false;
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'No se pudo actualizar la imagen'
        });
      }
    });
  }

  cancelar(): void {
    this.router.navigate(['/images/show']); // ajusta si usas /images/show
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
