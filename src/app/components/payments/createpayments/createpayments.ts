// src/app/components/payments/createpayments/createpayments.ts

import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { InputNumberModule } from 'primeng/inputnumber';
import { DatePickerModule } from 'primeng/datepicker';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { Select } from 'primeng/select';

import { AuthService } from '../../../services/auth';
import { PacientsI } from '../../../models/pacients';
import { MetodoPago } from '../../../models/payments';

type OptPaciente = { label: string; value: number };

@Component({
  selector: 'app-create-payments',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    ButtonModule,
    InputTextModule,
    InputNumberModule,
    DatePickerModule,
    ToastModule,
    Select
  ],
  templateUrl: './createpayments.html',
  styleUrls: ['./createpayments.css'],
  providers: [MessageService]
})
export class Createpayments implements OnInit {
  form!: FormGroup;
  loading = false;

  pacientesOpts: OptPaciente[] = [];

  metodos = [
    { label: 'Efectivo', value: 'EFECTIVO' as MetodoPago },
    { label: 'Tarjeta', value: 'TARJETA' as MetodoPago },
    { label: 'Transferencia', value: 'TRANSFERENCIA' as MetodoPago },
    { label: 'Otro', value: 'OTRO' as MetodoPago }
  ];

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private http: HttpClient,
    private auth: AuthService,
    private messageService: MessageService
  ) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      pacienteId: [null, Validators.required],
      estudioId: [null], // opcional
      monto: [null, [Validators.required, Validators.min(1)]],
      metodo: ['EFECTIVO', Validators.required],
      fecha: [new Date(), Validators.required] // Date; lo pasamos a YYYY-MM-DD
    });

    this.loadPacientes();
  }

  /** ===== Helpers ===== */

  private headers(): HttpHeaders {
    let h = new HttpHeaders();
    const t = this.auth.getToken?.();
    if (t) h = h.set('Authorization', `Bearer ${t}`);
    return h;
  }

  private loadPacientes(): void {
    this.http.get<any>('http://localhost:4000/api/pacientes', { headers: this.headers() })
      .subscribe({
        next: (data) => {
          const list: PacientsI[] =
            Array.isArray(data) ? data : (data.patients || data || []);
          this.pacientesOpts = (list || [])
            .filter(p => p.id != null)
            .map((p: PacientsI) => ({
              label: `${p.nombre} ${p.apellido}${p.documento ? ' (' + p.documento + ')' : ''}`,
              value: p.id as number
            }));
        },
        error: (err) => {
          console.error('Error cargando pacientes para pagos:', err);
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'No se pudieron cargar los pacientes'
          });
        }
      });
  }

  private toISODateOnly(d: Date): string {
    // YYYY-MM-DD en zona local
    const tzOff = d.getTimezoneOffset() * 60000;
    return new Date(d.getTime() - tzOff).toISOString().slice(0, 10);
  }

  get f() { return this.form.controls; }

  /** ===== Acciones ===== */

  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      this.messageService.add({
        severity: 'warn',
        summary: 'Campos requeridos',
        detail: 'Revisa el formulario.'
      });
      return;
    }

    const v = this.form.value;

    const payload = {
      pacienteId: v.pacienteId,
      estudioId: v.estudioId ?? null,
      monto: Number(v.monto),
      metodo: v.metodo as MetodoPago,
      fecha: this.toISODateOnly(v.fecha as Date)
      // estado: se deja que el backend use el default "PAID"
    };

    this.loading = true;

    this.http.post('http://localhost:4000/api/pagos', payload, {
      headers: this.headers()
    })
      .subscribe({
        next: (created: any) => {
          this.messageService.add({
            severity: 'success',
            summary: 'Éxito',
            detail: `Pago registrado correctamente${created?.id ? ' (#' + created.id + ')' : ''}`
          });
          setTimeout(() => this.router.navigate(['/payments/show']), 700);
        },
        error: (err) => {
          console.error('Error creando pago:', err);
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: err?.error?.error || 'No se pudo registrar el pago'
          });
          this.loading = false;
        }
      });
  }

  cancelar(): void {
    this.router.navigate(['/payments/show']);
  }
}
