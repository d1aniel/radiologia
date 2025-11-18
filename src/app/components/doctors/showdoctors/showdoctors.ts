// src/app/components/doctors/showdoctors/showdoctors.ts
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

import { MedicoI } from '../../../models/doctors';
import { MedicoService } from '../../../services/doctor';

@Component({
  selector: 'app-show-doctors',
  standalone: true,
  imports: [
    CommonModule,
    TableModule,
    ButtonModule,
    RouterModule,
    ConfirmDialogModule,
    ToastModule
  ],
  templateUrl: './showdoctors.html',
  styleUrls: ['./showdoctors.css'],
  encapsulation: ViewEncapsulation.None,
  providers: [ConfirmationService, MessageService]
})
export class Showdoctors implements OnInit {
  // 🔹 Dispara recargas (igual que en pacientes)
  private refresh$ = new BehaviorSubject<void>(undefined);

  // 🔹 Stream principal de doctores
  doctors$: Observable<MedicoI[]> = this.refresh$.pipe(
    switchMap(() =>
      this.medicoService.getAllMedicos().pipe(
        tap(ds => this.medicoService.updateLocalMedicos(ds)),
        catchError(err => {
          console.error('Error loading doctors:', err);
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Error al cargar los doctores'
          });
          return EMPTY;
        })
      )
    ),
    shareReplay(1)
  );

  // 🔹 Loading derivado del stream (evita NG0100)
  loading$: Observable<boolean> = this.doctors$.pipe(
    map(() => false),
    startWith(true)
  );

  constructor(
    private medicoService: MedicoService,
    private confirmationService: ConfirmationService,
    private messageService: MessageService
  ) {}

  ngOnInit(): void {
    // nada, todo va por async pipe
  }

  trackById = (_: number, item: MedicoI) => item.id;

  // 🔹 Borrado físico
  deleteDoctor(medico: MedicoI): void {
    this.confirmationService.confirm({
      message: `¿Está seguro de eliminar al doctor(a) ${medico.nombre}?`,
      header: 'Confirmar eliminación',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        if (medico.id != null) {
          this.medicoService.deleteMedico(medico.id).pipe(
            tap(() => {
              this.messageService.add({
                severity: 'success',
                summary: 'Éxito',
                detail: 'Doctor eliminado correctamente'
              });
              this.refresh$.next(); // recarga tabla
            }),
            catchError(error => {
              console.error('Error deleting doctor:', error);
              this.messageService.add({
                severity: 'error',
                summary: 'Error',
                detail: 'Error al eliminar el doctor'
              });
              return EMPTY;
            })
          ).subscribe();
        }
      }
    });
  }

  // 🔹 Borrado lógico (marca status = "INACTIVE")
  deleteDoctorAdv(medico: MedicoI): void {
    this.confirmationService.confirm({
      message: `¿Marcar como INACTIVE a ${medico.nombre}?`,
      header: 'Confirmar desactivación',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        if (medico.id != null) {
          this.medicoService.deleteMedicoAdv(medico.id).pipe(
            tap(() => {
              this.messageService.add({
                severity: 'info',
                summary: 'Actualizado',
                detail: 'Doctor marcado como INACTIVE'
              });
              // GET /doctors solo retorna ACTIVATE → dejará de aparecer
              this.refresh$.next();
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
