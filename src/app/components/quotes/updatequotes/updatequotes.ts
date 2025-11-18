// src/app/components/quotes/editquotes/editquotes.ts
import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { Select } from 'primeng/select';
import { DatePickerModule } from 'primeng/datepicker';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';

import { AuthService } from '../../../services/auth';
import { QuoteService } from '../../../services/quote';

type Opt = { label: string; value: number | string | null };

@Component({
  selector: 'app-edit-quotes',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    ButtonModule,
    InputTextModule,
    Select,
    DatePickerModule,
    ToastModule
  ],
  templateUrl: './updatequotes.html',
  styleUrls: ['./updatequotes.css'],
  providers: [MessageService]
})
export class Updatequotes implements OnInit {
  form!: FormGroup;
  loading = false;
  quoteId!: number;

  // Combos
  patients: Opt[] = [];
  technologists: Opt[] = [];
  modalities: Opt[] = [];
  teams: Opt[] = [];

  estadoOpts = [
    { label: 'Pendiente', value: 'PENDIENTE' },
    { label: 'Confirmada', value: 'CONFIRMADA' },
    { label: 'Atendida', value: 'ATENDIDA' },
    { label: 'Cancelada', value: 'CANCELADA' }
  ];

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private http: HttpClient,
    private auth: AuthService,
    private quoteService: QuoteService,
    private messageService: MessageService
  ) {
    this.form = this.fb.group({
      patient_id: [null, Validators.required],
      technologist_id: [null, Validators.required],
      modalidad: [null, Validators.required],
      equipo: [null, Validators.required],
      fechaHora: [null, Validators.required],
      motivo: ['', [Validators.required, Validators.minLength(3)]],
      estado: ['PENDIENTE', Validators.required]
    });
  }

  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('id');
    this.quoteId = Number(idParam);

    if (!this.quoteId) {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'ID de cita inválido'
      });
      this.router.navigate(['/quotes/show']);
      return;
    }

    this.loadCombos();
    this.cargarCita();
  }

  /* ===== Helpers ===== */

  private headers(): HttpHeaders {
    let h = new HttpHeaders();
    const t = this.auth.getToken?.();
    if (t) h = h.set('Authorization', `Bearer ${t}`);
    return h;
  }

  private loadCombos(): void {
    // Pacientes
    this.http.get<any>('http://localhost:4000/api/pacientes', { headers: this.headers() })
      .subscribe({
        next: (data) => {
          const list = Array.isArray(data) ? data : (data.patients || data);
          this.patients = (list || []).map((p: any) => ({
            label: `${p.nombre} ${p.apellido}${p.documento ? ' (' + p.documento + ')' : ''}`,
            value: p.id
          }));
        },
        error: () => {}
      });

    // Tecnólogos
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

    // Modalidades
    this.http.get<any>('http://localhost:4000/api/modalidades', { headers: this.headers() })
      .subscribe({
        next: (data) => {
          const list = Array.isArray(data) ? data : (data.modalidades || []);
          this.modalities = (list || []).map((m: any) => ({
            label: `${m.nombre} - ${m.descripcion ?? ''}`,
            value: m.nombre
          }));
        },
        error: () => {}
      });

    // Equipos
    this.http.get<any>('http://localhost:4000/api/equipos', { headers: this.headers() })
      .subscribe({
        next: (data) => {
          const list = Array.isArray(data) ? data : (data.teams || []);
          this.teams = (list || []).map((t: any) => ({
            label: `${t.nombre} - ${t.ubicacion} - ${t.estado}`,
            value: t.nombre
          }));
        },
        error: () => {}
      });
  }

  private cargarCita(): void {
    this.loading = true;
    this.quoteService.getQuoteById(this.quoteId).subscribe({
      next: (cita: any) => {   // 👈 aquí usamos any como en create
        this.form.patchValue({
          patient_id: cita.patient_id,
          technologist_id: cita.technologist_id,
          modalidad: cita.modalidad,
          equipo: cita.equipo,
          fechaHora: cita.fechaHora ? new Date(cita.fechaHora) : null,
          motivo: cita.motivo,
          estado: cita.estado
        });
        this.loading = false;
      },
      error: (err) => {
        console.error('Error cargando cita', err);
        this.loading = false;
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'No se pudo cargar la cita'
        });
        this.router.navigate(['/quotes/show']);
      }
    });
  }

  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.loading = true;
    const v = this.form.value;

    const payload: any = {
      patient_id: v.patient_id,
      technologist_id: v.technologist_id,
      modalidad: v.modalidad,
      equipo: v.equipo,
      fechaHora: (v.fechaHora instanceof Date)
        ? v.fechaHora.toISOString()
        : v.fechaHora,
      motivo: v.motivo,
      estado: v.estado   // 👈 aquí sí puede cambiar
    };

    this.quoteService.updateQuote(this.quoteId, payload).subscribe({
      next: () => {
        this.loading = false;
        this.messageService.add({
          severity: 'success',
          summary: 'Éxito',
          detail: 'Cita actualizada correctamente'
        });
        this.router.navigate(['/quotes/show']);
      },
      error: (err) => {
        console.error('Error actualizando cita', err);
        this.loading = false;
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'No se pudo actualizar la cita'
        });
      }
    });
  }

  cancelar(): void {
    this.router.navigate(['/quotes/show']);
  }

  getError(field: string): string {
    const c = this.form.get(field);
    if (!c || !c.touched || !c.errors) return '';
    if (c.errors['required']) return 'Campo requerido';
    if (c.errors['minlength']) return `Mínimo ${c.errors['minlength'].requiredLength} caracteres`;
    return 'Valor no válido';
  }
}
