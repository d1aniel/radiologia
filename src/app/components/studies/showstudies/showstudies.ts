// src/app/components/studies/showstudies/showstudies.ts
import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ToastModule } from 'primeng/toast';
import { ConfirmationService, MessageService } from 'primeng/api';

import { BehaviorSubject, EMPTY, Observable } from 'rxjs';
import { catchError, map, shareReplay, startWith, switchMap, tap } from 'rxjs/operators';

import { StudyReadI } from '../../../models/studies';
import { StudyService } from '../../../services/studie'; // ajusta ruta si es distinto

@Component({
  selector: 'app-show-studies',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    TableModule,
    ButtonModule,
    ConfirmDialogModule,
    ToastModule
  ],
  templateUrl: './showstudies.html',
  styleUrls: ['./showstudies.css'],
  encapsulation: ViewEncapsulation.None,
  providers: [ConfirmationService, MessageService]
})
export class ShowStudies implements OnInit {

  // 🔁 Dispara recargas (igual que en pacientes)
  private refresh$ = new BehaviorSubject<void>(undefined);

  // 📄 Stream principal de estudios
  studies$: Observable<StudyReadI[]> = this.refresh$.pipe(
    switchMap(() =>
      this.studyService.getAll().pipe(
        map(resp => resp.studies ?? []),
        tap(studies => this.studyService.setLocal(studies)),
        catchError(err => {
          console.error('Error loading studies:', err);
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Error al cargar los estudios'
          });
          return EMPTY;
        })
      )
    ),
    shareReplay(1)
  );

  // ⏳ Loading derivado del stream (como pacientes)
  loading$: Observable<boolean> = this.studies$.pipe(
    map(() => false),
    startWith(true)
  );

  constructor(
    private studyService: StudyService,
    private confirmationService: ConfirmationService,
    private messageService: MessageService
  ) {}

  ngOnInit(): void {
    // No subscribes manuales aquí, igual que en pacientes
  }

  // 🔴 Borrado FÍSICO (destruir definitivamente)
  deleteStudy(study: StudyReadI): void {
    this.confirmationService.confirm({
      message: `¿Está seguro de eliminar físicamente el estudio #${study.id}?`,
      header: 'Confirmar eliminación',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        if (study.id) {
          this.studyService.deleteHard(study.id).pipe(
            tap(() => {
              this.messageService.add({
                severity: 'success',
                summary: 'Éxito',
                detail: 'Estudio eliminado correctamente'
              });
              this.refresh$.next(); // recarga lista
            }),
            catchError(error => {
              console.error('Error deleting study:', error);
              this.messageService.add({
                severity: 'error',
                summary: 'Error',
                detail: 'Error al eliminar el estudio'
              });
              return EMPTY;
            })
          ).subscribe();
        }
      }
    });
  }

  // 🟡 Borrado LÓGICO: marca status = "INACTIVE"
  deleteStudyAdv(study: StudyReadI): void {
    this.confirmationService.confirm({
      message: `¿Marcar como INACTIVE el estudio #${study.id}?`,
      header: 'Confirmar desactivación',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        if (study.id) {
          // usa el endpoint existente de soft delete
          this.studyService.delete(study.id).pipe(
            tap(() => {
              this.messageService.add({
                severity: 'info',
                summary: 'Actualizado',
                detail: 'Estudio marcado como INACTIVE'
              });
              this.refresh$.next(); // recarga lista
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

  // Helpers de presentación (como ya tenías)
  fullPatientName(s: StudyReadI): string {
    if (!s.patient) return '—';
    const { nombre, apellido } = s.patient;
    return [nombre, apellido].filter(Boolean).join(' ');
  }

  modalityName(s: StudyReadI): string {
    return s.modalidad_obj?.nombre ?? '—';
  }

  teamName(s: StudyReadI): string {
    return s.team_obj?.nombre ?? '—';
  }

  doctorName(s: StudyReadI): string {
    return s.doctor?.nombre ?? '—';
  }

  technologistName(s: StudyReadI): string {
    return s.technologist_user?.nombre ?? '—';
  }

  labelsCount(s: StudyReadI): number {
    return s.labels?.length ?? 0;
  }
}
