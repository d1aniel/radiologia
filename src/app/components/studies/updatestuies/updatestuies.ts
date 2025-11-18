

import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { DatePickerModule } from 'primeng/datepicker';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { Select } from 'primeng/select';
import { MultiSelectModule } from 'primeng/multiselect';

import { AuthService } from '../../../services/auth';
import { StudyService } from '../../../services/studie';
import { StudyCreateI, StudyReadI, Prioridad } from '../../../models/studies';

type Opt = { label: string; value: number | null };

@Component({
  selector: 'app-edit-studies',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    ButtonModule,
    InputTextModule,
    DatePickerModule,
    ToastModule,
    Select,
    MultiSelectModule
  ],
  templateUrl: './updatestuies.html',
  styleUrls: ['./updatestuies.css'],
  providers: [MessageService]
})
export class Updatestuies implements OnInit {
  form!: FormGroup;
  loading = false;
  studyId!: number;

  
  patients: Opt[] = [];
  modalities: Opt[] = [];
  teams: Opt[] = [];
  doctors: Opt[] = [];
  technologists: Opt[] = [];
  labelsOpt: { label: string; value: number }[] = [];

  prioridadOpts: { label: string; value: Prioridad }[] = [
    { label: 'Baja', value: 'BAJA' },
    { label: 'Media', value: 'MEDIA' },
    { label: 'Alta', value: 'ALTA' },
    { label: 'Urgente', value: 'URGENTE' }
  ];

  statusOpts = [
    { label: 'Activo', value: 'ACTIVE' },
    { label: 'Inactivo', value: 'INACTIVE' }
  ];

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private http: HttpClient,
    private auth: AuthService,
    private studyService: StudyService,
    private messageService: MessageService
  ) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      patient_id: [null, Validators.required],
      modality_id: [null, Validators.required],
      team_id: [null, Validators.required],
      technologist_id: [null],
      medico_id: [null],
      quote_id: [null],

      fechaHora: [null, Validators.required],
      prioridad: ['MEDIA', Validators.required],
      motivo: ['', [Validators.required, Validators.minLength(3)]],
      status: ['ACTIVE', Validators.required],

      labels: [[]] 
    });

    const idParam = this.route.snapshot.paramMap.get('id');
    this.studyId = Number(idParam);

    if (!this.studyId) {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'ID de estudio inválido'
      });
      this.router.navigate(['/studies']);
      return;
    }

    this.loadCombos();
    this.cargarEstudio();
  }

  

  private headers(): HttpHeaders {
    let h = new HttpHeaders();
    const t = this.auth.getToken?.();
    if (t) h = h.set('Authorization', `Bearer ${t}`);
    return h;
  }

  private loadCombos(): void {
    
    this.http.get<any>('http://localhost:4000/api/pacientes', { headers: this.headers() })
      .subscribe({
        next: (data) => {
          const list = Array.isArray(data) ? data : (data.patients || data.studies || data);
          this.patients = (list || []).map((p: any) => ({
            label: `${p.nombre} ${p.apellido}${p.documento ? ' (' + p.documento + ')' : ''}`,
            value: p.id
          }));
        },
        error: () => {}
      });

    
    this.http.get<any>('http://localhost:4000/api/modalidades', { headers: this.headers() })
      .subscribe({
        next: (data) => {
          const list = Array.isArray(data) ? data : (data.modalidades || []);
          this.modalities = (list || []).map((m: any) => ({
            label: `${m.nombre} - ${m.descripcion ?? ''}`,
            value: m.id
          }));
        },
        error: () => {}
      });

    
    this.http.get<any>('http://localhost:4000/api/equipos', { headers: this.headers() })
      .subscribe({
        next: (data) => {
          const list = Array.isArray(data) ? data : (data.teams || []);
          this.teams = (list || []).map((t: any) => ({
            label: `${t.nombre} - ${t.ubicacion} - ${t.estado}`,
            value: t.id
          }));
        },
        error: () => {}
      });

    
    this.http.get<any>('http://localhost:4000/api/doctores', { headers: this.headers() })
      .subscribe({
        next: (data) => {
          const list = Array.isArray(data) ? data : (data.doctors || []);
          this.doctors = (list || []).map((d: any) => ({
            label: `${d.nombre} - ${d.especialidad}`,
            value: d.id
          }));
        },
        error: () => {}
      });

    
    this.http.get<any>('http://localhost:4000/api/tecnologos', { headers: this.headers() })
      .subscribe({
        next: (data) => {
          const list = Array.isArray(data) ? data : (data.technologists || []);
          this.technologists = (list || []).map((t: any) => ({
            label: `${t.nombre} - ${t.especialidad}`,
            value: t.id
          }));
        },
        error: () => {}
      });

    
    this.http.get<any>('http://localhost:4000/api/etiquetas', { headers: this.headers() })
      .subscribe({
        next: (data) => {
          const list = Array.isArray(data) ? data : (data.labels || []);
          this.labelsOpt = (list || []).map((l: any) => ({
            label: `${l.nombre} - ${l.descripcion ?? ''}`,
            value: l.id
          }));
        },
        error: () => {}
      });
  }

  private cargarEstudio(): void {
    this.loading = true;
    this.studyService.getById(this.studyId).subscribe({
      next: ({ study }: { study: StudyReadI }) => {
        this.form.patchValue({
          patient_id: study.patient_id,
          modality_id: study.modality_id,
          team_id: study.team_id,
          technologist_id: study.technologist_id,
          medico_id: study.medico_id,
          quote_id: study.quote_id,

          fechaHora: study.fechaHora ? new Date(study.fechaHora) : null,
          prioridad: study.prioridad,
          motivo: study.motivo,
          status: study.status,

          labels: (study.labels || []).map(l => l.id)
        });
        this.loading = false;
      },
      error: (err) => {
        console.error('Error cargando estudio', err);
        this.loading = false;
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'No se pudo cargar el estudio'
        });
        this.router.navigate(['/studies']);
      }
    });
  }

  submit(): void {
    if (this.form.invalid) {
      this.markAllTouched();
      this.messageService.add({
        severity: 'warn',
        summary: 'Campos requeridos',
        detail: 'Revisa el formulario.'
      });
      return;
    }

    const v = this.form.value;

    const payload: StudyCreateI = {
      patient_id: v.patient_id,
      modality_id: v.modality_id,
      team_id: v.team_id,
      technologist_id: v.technologist_id ?? null,
      medico_id: v.medico_id ?? null,
      quote_id: v.quote_id ?? null,
      fechaHora: (v.fechaHora instanceof Date) ? v.fechaHora.toISOString() : v.fechaHora,
      prioridad: v.prioridad,
      motivo: v.motivo,
      status: v.status,
      labels: v.labels ?? []
    };

    this.loading = true;
    this.studyService.update(this.studyId, payload).subscribe({
      next: ({ study }) => {
        this.messageService.add({
          severity: 'success',
          summary: 'Éxito',
          detail: `Estudio #${study.id} actualizado`
        });
        setTimeout(() => this.router.navigate(['/studies/show']), 700);
      },
      error: (err) => {
        console.error('Error updating study:', err);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: err?.error?.error || 'No se pudo actualizar el estudio'
        });
        this.loading = false;
      }
    });
  }

  cancelar(): void {
    this.router.navigate(['/studies/show']);
  }

  getError(field: string): string {
    const c = this.form.get(field);
    if (!c || !c.touched || !c.errors) return '';
    if (c.errors['required']) return 'Campo requerido';
    if (c.errors['minlength']) return `Mínimo ${c.errors['minlength'].requiredLength} caracteres`;
    return 'Valor no válido';
  }

  private markAllTouched(): void {
    Object.values(this.form.controls).forEach(c => c.markAsTouched());
  }
}
