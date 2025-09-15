import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { PaymentI } from '../models/payments';

@Injectable({ providedIn: 'root' })
export class PaymentsService {
  private paymentsSubject = new BehaviorSubject<PaymentI[]>([
    {
      id: 1,
      pacienteId: 1,
      estudioId: null,
      monto: 85000,
      metodo: 'EFECTIVO',
      fecha: '2025-09-14',
      estado: 'PAID'
    },
    {
      id: 2,
      pacienteId: 2,
      estudioId: 101,
      monto: 120000,
      metodo: 'TARJETA',
      fecha: '2025-09-10',
      estado: 'PAID'
    }
  ]);

  payments$ = this.paymentsSubject.asObservable();

  get value(): PaymentI[] {
    return this.paymentsSubject.value;
  }

  addPayment(payment: Omit<PaymentI, 'id' | 'estado'>) {
    const list = this.value;
    const nextId = list.length ? Math.max(...list.map(p => p.id)) + 1 : 1;
    const nuevo: PaymentI = { id: nextId, estado: 'PAID', ...payment };
    this.paymentsSubject.next([...list, nuevo]);
  }

  deletePayment(id: number) {
    this.paymentsSubject.next(this.value.filter(p => p.id !== id));
  }
}
