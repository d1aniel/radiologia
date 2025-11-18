// src/app/components/payments/editpayments/editpayments.ts
import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { InputNumberModule } from 'primeng/inputnumber';
import { DatePickerModule } from 'primeng/datepicker';
import { Select } from 'primeng/select';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';

import { PaymentService } from '../../../services/payment';
import { PatientService } from '../../../services/patient';
import { PaymentI, MetodoPago, EstadoPago } from '../../../models/payments';
import { PacientsI } from '../../../models/pacients';

type OptPaciente = { label: string; value: number };

@Component({
  selector: 'app-edit-payments',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    ButtonModule,
    InputTextModule,
    InputNumberModule,
    DatePickerModule,
    Select,
    ToastModule
  ],
  templateUrl: './updatepayments.html',
  styleUrls: ['./updatepayments.css'],
  providers: [MessageService]
})
export class Updatepayments implements OnInit {
  form: FormGroup;
  loading = false;
  paymentId!: number;

  pacientesOpts: OptPaciente[] = [];

  metodoOptions = [
    { label: 'Efectivo', value: 'EFECTIVO' as MetodoPago },
    { label: 'Tarjeta', value: 'TARJETA' as MetodoPago },
    { label: 'Transferencia', value: 'TRANSFERENCIA' as MetodoPago },
    { label: 'Otro', value: 'OTRO' as MetodoPago }
  ];

  estadoOptions = [
    { label: 'Pagado', value: 'PAID' as EstadoPago },
    { label: 'Pendiente', value: 'PENDING' as EstadoPago },
    { label: 'Anulado (VOID)', value: 'VOID' as EstadoPago }
  ];

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private paymentsService: PaymentService,
    private patientsService: PatientService,
    private messageService: MessageService
  ) {
    this.form = this.fb.group({
      pacienteId: [null, Validators.required],
      estudioId: [null], // opcional (quote_id)
      monto: [null, [Validators.required, Validators.min(1)]],
      metodo: ['EFECTIVO', Validators.required],
      fecha: [null, Validators.required], // Date en el form
      estado: ['PAID', Validators.required]
    });
  }

  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('id');
    this.paymentId = Number(idParam);

    if (!this.paymentId) {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'ID de pago inválido'
      });
      this.router.navigate(['/payments/show']);
      return;
    }

    this.cargarPacientes();
    this.cargarPago();
  }

  /** ===== Helpers ===== */

  private cargarPacientes(): void {
    this.patientsService.getAllPatients().subscribe({
      next: (list: PacientsI[]) => {
        this.pacientesOpts = list
          .filter(p => p.id != null)
          .map(p => ({
            label: `${p.nombre} ${p.apellido}${p.documento ? ' (' + p.documento + ')' : ''}`,
            value: p.id as number
          }));
      },
      error: (err) => {
        console.error('Error cargando pacientes para pagos', err);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'No se pudieron cargar los pacientes'
        });
      }
    });
  }

  private cargarPago(): void {
    this.loading = true;
    this.paymentsService.getPaymentById(this.paymentId).subscribe({
      next: (payment: PaymentI) => {
        this.form.patchValue({
          pacienteId: payment.pacienteId,
          estudioId: payment.estudioId ?? null,
          monto: payment.monto,
          metodo: payment.metodo,
          fecha: payment.fecha ? new Date(payment.fecha) : null,
          estado: payment.estado
        });
        this.loading = false;
      },
      error: (err) => {
        console.error('Error cargando pago', err);
        this.loading = false;
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'No se pudo cargar el pago'
        });
        this.router.navigate(['/payments/show']);
      }
    });
  }

  private toISODateOnly(d: Date): string {
    const tzOff = d.getTimezoneOffset() * 60000;
    return new Date(d.getTime() - tzOff).toISOString().slice(0, 10);
  }

  get f() { return this.form.controls; }

  /** ===== Acciones ===== */

  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.loading = true;
    const v = this.form.value;

    const payload: Partial<PaymentI> = {
      pacienteId: v.pacienteId,
      estudioId: v.estudioId ?? null,
      monto: Number(v.monto),
      metodo: v.metodo as MetodoPago,
      fecha: this.toISODateOnly(v.fecha as Date),
      estado: v.estado as EstadoPago
    };

    this.paymentsService.updatePayment(this.paymentId, payload).subscribe({
      next: () => {
        this.loading = false;
        this.messageService.add({
          severity: 'success',
          summary: 'Éxito',
          detail: 'Pago actualizado correctamente'
        });
        this.router.navigate(['/payments/show']);
      },
      error: (err) => {
        console.error('Error actualizando pago', err);
        this.loading = false;
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: err?.error?.error || 'No se pudo actualizar el pago'
        });
      }
    });
  }

  cancelar(): void {
    this.router.navigate(['/payments/show']);
  }
}
