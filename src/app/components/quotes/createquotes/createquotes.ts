
import { CommonModule } from '@angular/common';
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

import { AuthService } from '../../../services/auth';
import { QuoteService } from '../../../services/quote';

type Opt = { label: string; value: number | string | null };

@Component({
  selector: 'app-create-quotes',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    ButtonModule,
    InputTextModule,
    DatePickerModule,
    ToastModule,
    Select
  ],
  templateUrl: './createquotes.html',
  styleUrls: ['./createquotes.css'],
  providers: [MessageService]
})
export class Createquotes implements OnInit {
  form!: FormGroup;
  loading = false;

  
  patients: Opt[] = [];
  technologists: Opt[] = [];
  modalities: Opt[] = [];
  teams: Opt[] = [];

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private http: HttpClient,
    private auth: AuthService,
    private citaService: QuoteService,
    private messageService: MessageService
  ) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      patient_id: [null, Validators.required],
      technologist_id: [null, Validators.required],
      modalidad: [null, Validators.required],
      equipo: [null, Validators.required],
      fechaHora: [new Date(), Validators.required],
      motivo: ['', [Validators.required, Validators.minLength(3)]]
      
    });

    this.loadCombos();
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
          const list = Array.isArray(data) ? data : (data.patients || data);
          this.patients = (list || []).map((p: any) => ({
            label: `${p.nombre} ${p.apellido}${p.documento ? ' (' + p.documento + ')' : ''}`,
            value: p.id
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

    const payload: any = {
      patient_id: v.patient_id,
      technologist_id: v.technologist_id,
      modalidad: v.modalidad,
      equipo: v.equipo,
      fechaHora: (v.fechaHora instanceof Date)
        ? v.fechaHora.toISOString()
        : v.fechaHora,
      motivo: v.motivo,
      estado: 'PENDIENTE' 
    };

    this.loading = true;
    this.citaService.createQuote(payload).subscribe({
      next: (quote) => {
        this.messageService.add({
          severity: 'success',
          summary: 'Éxito',
          detail: `Cita #${quote.id} creada`
        });
        setTimeout(() => this.router.navigate(['/quotes/show']), 700);
      },
      error: (err) => {
        console.error('Error creating quote:', err);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: err?.error?.error || 'No se pudo crear la cita'
        });
        this.loading = false;
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

  private markAllTouched(): void {
    Object.values(this.form.controls).forEach(c => c.markAsTouched());
  }
}
