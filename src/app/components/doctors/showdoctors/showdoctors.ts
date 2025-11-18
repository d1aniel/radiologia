
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
  
  private refresh$ = new BehaviorSubject<void>(undefined);

  
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
    
  }

  trackById = (_: number, item: MedicoI) => item.id;

  
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
              this.refresh$.next(); 
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
