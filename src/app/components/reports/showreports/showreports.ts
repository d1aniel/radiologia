import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { RouterModule } from '@angular/router';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ToastModule } from 'primeng/toast';
import { ConfirmationService, MessageService } from 'primeng/api';

import { BehaviorSubject, EMPTY, Observable } from 'rxjs';
import { catchError, map, shareReplay, startWith, switchMap, tap } from 'rxjs/operators';

import { InformeI } from '../../../models/reports';
import { ReportService } from '../../../services/report';

@Component({
  selector: 'app-show-reports',
  standalone: true,
  imports: [
    CommonModule,
    TableModule,
    ButtonModule,
    RouterModule,
    ConfirmDialogModule,
    ToastModule
  ],
  templateUrl: './showreports.html',
  styleUrls: ['./showreports.css'],
  encapsulation: ViewEncapsulation.None,
  providers: [ConfirmationService, MessageService]
})
export class Showreports implements OnInit {
  // Dispara recargas (igual que en pacientes)
  private refresh$ = new BehaviorSubject<void>(undefined);

  // Stream principal de informes
  informes$: Observable<InformeI[]> = this.refresh$.pipe(
    switchMap(() =>
      this.reportService.getAllReports().pipe(
        // Si quieres mantenerlos también en el service:
        // tap(i => this.informeService.updateLocalReports(i)),
        catchError(err => {
          console.error('Error loading reports:', err);
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Error al cargar los informes'
          });
          return EMPTY;
        })
      )
    ),
    shareReplay(1)
  );

  // Loading derivado del stream
  loading$: Observable<boolean> = this.informes$.pipe(
    map(() => false),
    startWith(true)
  );

  constructor(
    private reportService: ReportService,
    private confirmationService: ConfirmationService,
    private messageService: MessageService
  ) {}

  ngOnInit(): void {
    // nada aquí, todo va por el stream
  }

  trackById = (_: number, item: InformeI) => item.id;

  deleteReport(report: InformeI): void {
    this.confirmationService.confirm({
      message: `¿Está seguro de eliminar el informe #${report.id}?`,
      header: 'Confirmar eliminación',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.reportService.deleteReport(report.id).pipe(
          tap(() => {
            this.messageService.add({
              severity: 'success',
              summary: 'Éxito',
              detail: 'Informe eliminado correctamente'
            });
            this.refresh$.next(); // recarga
          }),
          catchError(error => {
            console.error('Error deleting report:', error);
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: 'Error al eliminar el informe'
            });
            return EMPTY;
          })
        ).subscribe();
      }
    });
  }

  // Firmar informe (cambiar estado a FIRMADO)
  signReport(report: InformeI): void {
    this.confirmationService.confirm({
      message: `¿Desea firmar el informe #${report.id}?`,
      header: 'Confirmar firma',
      icon: 'pi pi-check-circle',
      accept: () => {
        this.reportService.signReport(report.id).pipe(
          tap(() => {
            this.messageService.add({
              severity: 'success',
              summary: 'Firmado',
              detail: 'Informe firmado correctamente'
            });
            this.refresh$.next(); // recarga
          }),
          catchError(error => {
            console.error('Error signing report:', error);
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: 'No se pudo firmar el informe'
            });
            return EMPTY;
          })
        ).subscribe();
      }
    });
  }
}
