import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';

import { InputTextModule } from 'primeng/inputtext';
import { InputNumberModule } from 'primeng/inputnumber';
import { DatePickerModule } from 'primeng/datepicker';
import { ButtonModule } from 'primeng/button';
import { SelectModule } from 'primeng/select';

import { PaymentsService } from '../../../services/payment';
import { PatientsService } from '../../../services/patient';
import { PacientsI } from '../../../models/pacients';
import { MetodoPago } from '../../../models/payments';

@Component({
  selector: 'app-create-payments',
  standalone: true,
  imports: [
    CommonModule, ReactiveFormsModule, RouterModule,
    InputTextModule, InputNumberModule, DatePickerModule,
    ButtonModule, SelectModule
  ],
  templateUrl: './createpayments.html'
})
export class Createpayments {
  form: FormGroup;
  pacientesOptions: {label: string; value: number}[] = [];
  metodos: {label: string; value: MetodoPago}[] = [
    { label: 'Efectivo', value: 'EFECTIVO' },
    { label: 'Tarjeta', value: 'TARJETA' },
    { label: 'Transferencia', value: 'TRANSFERENCIA' },
    { label: 'Otro', value: 'OTRO' }
  ];

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private paymentsService: PaymentsService,
    private patientsService: PatientsService
  ) {
    this.form = this.fb.group({
      pacienteId: [null, Validators.required],
      estudioId: [null], // opcional
      monto: [null, [Validators.required, Validators.min(1)]],
      metodo: ['EFECTIVO', Validators.required],
      fecha: [new Date(), Validators.required] // Date; lo convertimos a string al guardar
    });

    this.patientsService.patients$.subscribe(list => {
      this.pacientesOptions = list.map((p: PacientsI) => ({
        label: `${p.nombre} ${p.apellido} (${p.documento})`,
        value: p.id
      }));
    });
  }

  get f() { return this.form.controls; }

  private toISODateOnly(d: Date): string {
    // YYYY-MM-DD
    const tzOff = d.getTimezoneOffset() * 60000;
    return new Date(d.getTime() - tzOff).toISOString().slice(0, 10);
  }

  onSubmit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const raw = this.form.value;
    const payload = {
      pacienteId: raw.pacienteId,
      estudioId: raw.estudioId ?? null,
      monto: Number(raw.monto),
      metodo: raw.metodo,
      fecha: this.toISODateOnly(raw.fecha as Date)
      // estado se setea en el service como 'PAID'
    };

    this.paymentsService.addPayment(payload as any);
    this.router.navigate(['/payments/show']);
  }

  onCancel() {
    this.router.navigate(['/payments/show']);
  }
}
