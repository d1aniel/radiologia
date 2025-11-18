
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

import { TecnologoI } from '../../../models/technologists'; 
import { TechnologistService } from '../../../services/technologist'; 

@Component({
  selector: 'app-show-technologists',
  standalone: true,
  imports: [
    CommonModule,
    TableModule,
    ButtonModule,
    RouterModule,
    ConfirmDialogModule,
    ToastModule
  ],
  templateUrl: './showtechnologists.html',
  styleUrls: ['./showtechnologists.css'],
  encapsulation: ViewEncapsulation.None,
  providers: [ConfirmationService, MessageService]
})
export class Showtechnologists implements OnInit {
  
  private refresh$ = new BehaviorSubject<void>(undefined);

  
  technologists$: Observable<TecnologoI[]> = this.refresh$.pipe(
    switchMap(() =>
      this.technologistService.getAllTechnologists().pipe(
        tap(t => this.technologistService.updateLocalTechnologists(t)),
        catchError(err => {
          console.error('Error loading technologists:', err);
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Error al cargar los tecnólogos'
          });
          return EMPTY;
        })
      )
    ),
    shareReplay(1)
  );

  
  loading$: Observable<boolean> = this.technologists$.pipe(
    map(() => false),
    startWith(true)
  );

  constructor(
    private technologistService: TechnologistService,
    private confirmationService: ConfirmationService,
    private messageService: MessageService
  ) {}

  ngOnInit(): void {
    
  }

  trackById = (_: number, item: TecnologoI) => item.id;

  deleteTechnologist(technologist: TecnologoI): void {
    this.confirmationService.confirm({
      message: `¿Está seguro de eliminar al tecnólogo ${technologist.nombre}?`,
      header: 'Confirmar eliminación',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        if (technologist.id) {
          this.technologistService.deleteTechnologist(technologist.id).pipe(
            tap(() => {
              this.messageService.add({
                severity: 'success',
                summary: 'Éxito',
                detail: 'Tecnólogo eliminado correctamente'
              });
              this.refresh$.next(); 
            }),
            catchError(error => {
              console.error('Error deleting technologist:', error);
              this.messageService.add({
                severity: 'error',
                summary: 'Error',
                detail: 'Error al eliminar el tecnólogo'
              });
              return EMPTY;
            })
          ).subscribe();
        }
      }
    });
  }

  
  deleteTechnologistAdv(technologist: TecnologoI): void {
    this.confirmationService.confirm({
      message: `¿Marcar como INACTIVE al tecnólogo ${technologist.nombre}?`,
      header: 'Confirmar desactivación',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        if (technologist.id) {
          this.technologistService.deleteTechnologistAdv(technologist.id).pipe(
            tap(() => {
              this.messageService.add({
                severity: 'info',
                summary: 'Actualizado',
                detail: 'Tecnólogo marcado como INACTIVE'
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
