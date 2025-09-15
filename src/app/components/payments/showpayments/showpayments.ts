import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { TagModule } from 'primeng/tag';
import { RouterModule } from '@angular/router';

import { PaymentsService } from '../../../services/payment';
import { PatientsService } from '../../../services/patient';
import { PaymentI } from '../../../models/payments';
import { PacientsI } from '../../../models/pacients';

@Component({
  selector: 'app-show-payments',
  standalone: true,
  imports: [CommonModule, TableModule, ButtonModule, TagModule, RouterModule],
  templateUrl: './showpayments.html'
})
export class Showpayments {
  payments: PaymentI[] = [];
  patientsIndex = new Map<number, PacientsI>();

  constructor(
    private paymentsService: PaymentsService,
    private patientsService: PatientsService
  ) {
    // Cargamos pacientes para mostrar el nombre en la tabla
    this.patientsService.patients$.subscribe(ps => {
      this.patientsIndex.clear();
      ps.forEach(p => this.patientsIndex.set(p.id, p));
    });

    this.paymentsService.payments$.subscribe(list => {
      this.payments = list;
    });
  }

  getPatientName(id: number) {
    const p = this.patientsIndex.get(id);
    return p ? `${p.nombre} ${p.apellido}` : `ID ${id}`;
  }

  colorEstado(estado: PaymentI['estado']) {
    switch (estado) {
      case 'PAID': return 'success';
      case 'PENDING': return 'warn';
      case 'VOID': return 'danger';
      default: return 'secondary';
    }
  }

  onDelete(id: number) {
    this.paymentsService.deletePayment(id);
  }
}
