// src/app/components/payments/showpayments/showpayments.ts
import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { TagModule } from 'primeng/tag';
import { RouterModule } from '@angular/router';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ToastModule } from 'primeng/toast';
import { ConfirmationService, MessageService } from 'primeng/api';

import { BehaviorSubject, EMPTY, Observable } from 'rxjs';
import { catchError, map, shareReplay, startWith, switchMap, tap } from 'rxjs/operators';

import { PaymentI } from '../../../models/payments';
import { PaymentService } from '../../../services/payment';   // 👈 Ojo: nombre igual al service que creamos
import { PacientsI } from '../../../models/pacients';
import { PatientService } from '../../../services/patient';

@Component({
  selector: 'app-show-payments',
  standalone: true,
  imports: [
    CommonModule,
    TableModule,
    ButtonModule,
    TagModule,
    RouterModule,
    ConfirmDialogModule,
    ToastModule
  ],
  templateUrl: './showpayments.html',
  styleUrls: ['./showpayments.css'],
  encapsulation: ViewEncapsulation.None,
  providers: [ConfirmationService, MessageService]
})
export class Showpayments implements OnInit {
  // Dispara recargas de la tabla
  private refresh$ = new BehaviorSubject<void>(undefined);

  // Stream principal de pagos
  payments$: Observable<PaymentI[]> = this.refresh$.pipe(
    switchMap(() =>
      this.paymentsService.getAllPayments().pipe(
        tap(p => this.paymentsService.updateLocalPayments(p)),
        catchError(err => {
          console.error('Error loading payments:', err);
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Error al cargar los pagos'
          });
          return EMPTY;
        })
      )
    ),
    shareReplay(1)
  );

  // Loading derivado del stream
  loading$: Observable<boolean> = this.payments$.pipe(
    map(() => false),
    startWith(true)
  );

  // Índice de pacientes para mostrar nombre en lugar de ID
  patientsIndex = new Map<number, PacientsI>();

  constructor(
    private paymentsService: PaymentService,
    private patientsService: PatientService,
    private confirmationService: ConfirmationService,
    private messageService: MessageService
  ) {}

  ngOnInit(): void {
    // Cargamos pacientes una vez para tener el índice
    this.patientsService.getAllPatients().subscribe(ps => {
      this.patientsIndex.clear();
      ps.forEach(p => {
        if (p.id != null) {
          this.patientsIndex.set(p.id, p);
        }
      });
    });
  }

  trackById = (_: number, item: PaymentI) => item.id;

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

  // Borrado físico
  deletePayment(payment: PaymentI): void {
    this.confirmationService.confirm({
      message: `¿Está seguro de eliminar el pago #${payment.id}?`,
      header: 'Confirmar eliminación',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        if (payment.id) {
          this.paymentsService.deletePayment(payment.id).pipe(
            tap(() => {
              this.messageService.add({
                severity: 'success',
                summary: 'Éxito',
                detail: 'Pago eliminado correctamente'
              });
              this.refresh$.next(); // recarga la tabla
            }),
            catchError(error => {
              console.error('Error deleting payment:', error);
              this.messageService.add({
                severity: 'error',
                summary: 'Error',
                detail: 'Error al eliminar el pago'
              });
              return EMPTY;
            })
          ).subscribe();
        }
      }
    });
  }

  // Borrado lógico -> marca estado = "VOID"
  deletePaymentAdv(payment: PaymentI): void {
    this.confirmationService.confirm({
      message: `¿Marcar como VOID el pago #${payment.id}?`,
      header: 'Confirmar anulación',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        if (payment.id) {
          this.paymentsService.deletePaymentAdv(payment.id).pipe(
            tap(() => {
              this.messageService.add({
                severity: 'info',
                summary: 'Actualizado',
                detail: 'Pago marcado como VOID'
              });
              this.refresh$.next(); // recarga
            }),
            catchError(error => {
              console.error('Error marcando VOID:', error);
              this.messageService.add({
                severity: 'error',
                summary: 'Error',
                detail: 'No se pudo marcar como VOID'
              });
              return EMPTY;
            })
          ).subscribe();
        }
      }
    });
  }
}
