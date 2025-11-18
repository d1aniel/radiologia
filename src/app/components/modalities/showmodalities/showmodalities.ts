// src/app/components/modalities/showmodalities/showmodalities.ts
import { Component, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { Observable, BehaviorSubject, EMPTY } from 'rxjs';
import { catchError, map, shareReplay, startWith, switchMap, tap } from 'rxjs/operators';

import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { TagModule } from 'primeng/tag';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ToastModule } from 'primeng/toast';
import { ConfirmationService, MessageService } from 'primeng/api';

import { ModalidadService } from '../../../services/modaliti'; // 👈 ajusta si tu archivo se llama distinto (modaliti)
import { ModalidadI } from '../../../models/modalities';

@Component({
  selector: 'app-showmodalidad',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    TableModule,
    ButtonModule,
    TagModule,
    ConfirmDialogModule,
    ToastModule
  ],
  templateUrl: './showmodalities.html',
  styleUrls: ['./showmodalities.css'],
  encapsulation: ViewEncapsulation.None,
  providers: [ConfirmationService, MessageService]
})
export class Showmodalities {
  // Dispara recargas
  private refresh$ = new BehaviorSubject<void>(undefined);

  // Stream principal de modalidades (pide al backend cada vez que se hace refresh)
  modalidades$: Observable<ModalidadI[]> = this.refresh$.pipe(
    switchMap(() =>
      this.service.getAllModalidades().pipe(
        tap(list => this.service.updateLocalModalidades(list)),
        catchError(err => {
          console.error('Error loading modalidades:', err);
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Error al cargar las modalidades'
          });
          return EMPTY;
        })
      )
    ),
    shareReplay(1)
  );

  // Loading derivado del stream
  loading$: Observable<boolean> = this.modalidades$.pipe(
    map(() => false),
    startWith(true)
  );

  constructor(
    private service: ModalidadService,
    private confirmationService: ConfirmationService,
    private messageService: MessageService
  ) {}

  trackById = (_: number, item: ModalidadI) => item.id;

  actTag(activa: boolean) {
    return {
      severity: activa ? 'success' : 'danger',
      label: activa ? 'Sí' : 'No'
    };
  }

  // 🔴 Eliminar físico
  deleteModalidad(row: ModalidadI) {
    this.confirmationService.confirm({
      message: `¿Está seguro de eliminar la modalidad "${row.nombre}" de forma permanente?`,
      header: 'Confirmar eliminación',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.service.deleteModalidad(row.id).pipe(
          tap(() => {
            this.messageService.add({
              severity: 'success',
              summary: 'Éxito',
              detail: 'Modalidad eliminada correctamente'
            });
            this.refresh$.next(); // recargar
          }),
          catchError(err => {
            console.error('Error deleting modalidad:', err);
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: 'No se pudo eliminar la modalidad'
            });
            return EMPTY;
          })
        ).subscribe();
      }
    });
  }

  // 🟡 Borrado lógico (activa = false)
  deleteModalidadAdv(row: ModalidadI) {
    this.confirmationService.confirm({
      message: `¿Marcar como INACTIVA la modalidad "${row.nombre}"?`,
      header: 'Confirmar desactivación',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.service.deleteModalidadAdv(row.id).pipe(
          tap(() => {
            this.messageService.add({
              severity: 'info',
              summary: 'Actualizado',
              detail: 'Modalidad marcada como INACTIVA'
            });
            this.refresh$.next(); // recargar
          }),
          catchError(err => {
            console.error('Error marcando modalidad como inactiva:', err);
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: 'No se pudo marcar la modalidad como INACTIVA'
            });
            return EMPTY;
          })
        ).subscribe();
      }
    });
  }
}
