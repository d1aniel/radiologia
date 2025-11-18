// src/app/components/patients/showpatients/showpatients.ts
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

import { PacientsI } from '../../../models/pacients';
import { PatientService } from '../../../services/patient';

@Component({
  selector: 'app-show-patients',
  standalone: true,
  imports: [
    CommonModule,
    TableModule,
    ButtonModule,
    RouterModule,
    ConfirmDialogModule,
    ToastModule
  ],
  templateUrl: './showpatients.html',
  styleUrls: ['./showpatients.css'],
  encapsulation: ViewEncapsulation.None,
  providers: [ConfirmationService, MessageService]
})
export class Showpatients implements OnInit {
  // Dispara recargas
  private refresh$ = new BehaviorSubject<void>(undefined);

  // Stream principal de pacientes
  pacients$: Observable<PacientsI[]> = this.refresh$.pipe(
    switchMap(() =>
      this.patientsService.getAllPatients().pipe(
        tap(p => this.patientsService.updateLocalPatients(p)),
        catchError(err => {
          console.error('Error loading patients:', err);
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Error al cargar los pacientes'
          });
          return EMPTY;
        })
      )
    ),
    shareReplay(1)
  );

  // Loading derivado del stream (evita NG0100)
  loading$: Observable<boolean> = this.pacients$.pipe(
    map(() => false),
    startWith(true)
  );

  constructor(
    private patientsService: PatientService,
    private confirmationService: ConfirmationService,
    private messageService: MessageService
  ) {}

  ngOnInit(): void {
    // No subscribe aquí
  }

  trackById = (_: number, item: PacientsI) => item.id ?? item.documento;

  deletePatient(patient: PacientsI): void {
    this.confirmationService.confirm({
      message: `¿Está seguro de eliminar al paciente ${patient.nombre} ${patient.apellido}?`,
      header: 'Confirmar eliminación',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        if (patient.id) {
          this.patientsService.deletePatient(patient.id).pipe(
            tap(() => {
              this.messageService.add({
                severity: 'success',
                summary: 'Éxito',
                detail: 'Paciente eliminado correctamente'
              });
              this.refresh$.next(); // recarga
            }),
            catchError(error => {
              console.error('Error deleting patient:', error);
              this.messageService.add({
                severity: 'error',
                summary: 'Error',
                detail: 'Error al eliminar el paciente'
              });
              return EMPTY;
            })
          ).subscribe();
        }
      }
    });
  }

  // 🔹 Borrado lógico: marca status = "INACTIVE"
  deletePatientAdv(patient: PacientsI): void {
    this.confirmationService.confirm({
      message: `¿Marcar como INACTIVE a ${patient.nombre} ${patient.apellido}?`,
      header: 'Confirmar desactivación',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        if (patient.id) {
          this.patientsService.deletePatientAdv(patient.id).pipe(
            tap(() => {
              this.messageService.add({
                severity: 'info',
                summary: 'Actualizado',
                detail: 'Paciente marcado como INACTIVE'
              });
              this.refresh$.next(); // recarga
            }),
            catchError(error => {
              console.error('Error marcando INACTIVE:', error);
              this.messageService.add({
                severity: 'error',
                summary: 'Error',
                detail: 'No se pudo marcar como INACTIVE'
              });
              return EMPTY;
            })
          ).subscribe();
        }
      }
    });
  }
}
