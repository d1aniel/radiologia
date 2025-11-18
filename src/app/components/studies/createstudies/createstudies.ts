import { NgIf } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
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
import { StudyCreateI, Prioridad } from '../../../models/studies';

type Opt = { label: string; value: number | null };

@Component({
  selector: 'app-create-studies',
  standalone: true,
  imports: [
    NgIf,
    ReactiveFormsModule,
    ButtonModule,
    InputTextModule,
    DatePickerModule,
    ToastModule,
    Select,
    MultiSelectModule
  ],
  templateUrl: './createstudies.html',
  styleUrls: ['./createstudies.css'],
  providers: [MessageService]
})
export class Createstudies implements OnInit {
  form!: FormGroup;
  loading = false;

  // Combos
  patients: Opt[] = [];
  modalities: Opt[] = [];
  teams: Opt[] = [];
  doctors: Opt[] = [];
  technologists: Opt[] = [];
  labelsOpt: { label: string; value: number }[] = [];

  // Opciones estáticas
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

      fechaHora: [new Date(), Validators.required], // Calendar devuelve Date
      prioridad: ['MEDIA', Validators.required],
      motivo: ['', [Validators.required, Validators.minLength(3)]],
      status: ['ACTIVE', Validators.required],

      labels: [[]] // number[]
    });

    // Cargar combos
    this.loadCombos();
  }

  /** ====== Helpers ====== */
  private headers(): HttpHeaders {
    let h = new HttpHeaders();
    const t = this.auth.getToken?.();
    if (t) h = h.set('Authorization', `Bearer ${t}`);
    return h;
  }

  private loadCombos(): void {
    // Ajusta si tus endpoints difieren. Estos son convenciones típicas:
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
          // Tu backend devuelve { teams: [...] }
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

  submit(): void {
    if (this.form.invalid) {
      this.markAllTouched();
      this.messageService.add({ severity: 'warn', summary: 'Campos requeridos', detail: 'Revisa el formulario.' });
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
    this.studyService.create(payload).subscribe({
      next: ({ study }) => {
        this.messageService.add({ severity: 'success', summary: 'Éxito', detail: `Estudio #${study.id} creado` });
        setTimeout(() => this.router.navigate(['/studies/show']), 700);
      },
      error: (err) => {
        console.error('Error creating study:', err);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: err?.error?.error || 'No se pudo crear el estudio'
        });
        this.loading = false;
      }
    });
  }

  cancelar(): void {
    this.router.navigate(['studies/show']);
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
