// src/app/components/labels/showlabels/showlabels.ts
import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { TagModule } from 'primeng/tag';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ToastModule } from 'primeng/toast';
import { ConfirmationService, MessageService } from 'primeng/api';

import { BehaviorSubject, EMPTY, Observable } from 'rxjs';
import {
  catchError,
  map,
  shareReplay,
  startWith,
  switchMap,
  tap
} from 'rxjs/operators';

import { LabelsI } from '../../../models/labels';
// 👇 Usa el nombre real de tu service: LabelService o TagsService
import { LabelService } from '../../../services/label';

@Component({
  selector: 'app-show-labels',
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
  templateUrl: './showlabels.html',
  styleUrls: ['./showlabels.css'],
  encapsulation: ViewEncapsulation.None,
  providers: [ConfirmationService, MessageService]
})
export class Showlabels implements OnInit {
  // Dispara recargas
  private refresh$ = new BehaviorSubject<void>(undefined);

  // Stream principal de labels
  labels$: Observable<LabelsI[]> = this.refresh$.pipe(
    switchMap(() =>
      this.labelService.getAllLabels().pipe(
        tap(labels => this.labelService.updateLocalLabels(labels)),
        catchError(err => {
          console.error('Error loading labels:', err);
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Error al cargar las etiquetas'
          });
          return EMPTY;
        })
      )
    ),
    shareReplay(1)
  );

  // Loading derivado del stream
  loading$: Observable<boolean> = this.labels$.pipe(
    map(() => false),
    startWith(true)
  );

  constructor(
    private labelService: LabelService,
    private confirmationService: ConfirmationService,
    private messageService: MessageService
  ) {}

  ngOnInit(): void {
    // Nada aquí, el stream se dispara con refresh$
  }

  trackById = (_: number, item: LabelsI) => item.id;

  // 🔴 Eliminar físico
  deleteLabel(label: LabelsI): void {
    this.confirmationService.confirm({
      message: `¿Está seguro de eliminar la etiqueta "${label.nombre}"?`,
      header: 'Confirmar eliminación',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        if (label.id) {
          this.labelService
            .deleteLabel(label.id)
            .pipe(
              tap(() => {
                this.messageService.add({
                  severity: 'success',
                  summary: 'Éxito',
                  detail: 'Etiqueta eliminada correctamente'
                });
                this.refresh$.next(); // recarga
              }),
              catchError(error => {
                console.error('Error deleting label:', error);
                this.messageService.add({
                  severity: 'error',
                  summary: 'Error',
                  detail: 'Error al eliminar la etiqueta'
                });
                return EMPTY;
              })
            )
            .subscribe();
        }
      }
    });
  }

  // 🟡 Borrado lógico: status = "INACTIVE"
  deleteLabelAdv(label: LabelsI): void {
    this.confirmationService.confirm({
      message: `¿Marcar como INACTIVE la etiqueta "${label.nombre}"?`,
      header: 'Confirmar desactivación',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        if (label.id) {
          this.labelService
            .deleteLabelAdv(label.id)
            .pipe(
              tap(() => {
                this.messageService.add({
                  severity: 'info',
                  summary: 'Actualizado',
                  detail: 'Etiqueta marcada como INACTIVE'
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
            )
            .subscribe();
        }
      }
    });
  }
}
