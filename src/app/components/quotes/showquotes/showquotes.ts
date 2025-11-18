// src/app/components/quotes/showquotes/showquotes.ts
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

import { CitaI } from '../../../models/quotes';
import { QuoteService } from '../../../services/quote';

@Component({
  selector: 'app-show-quotes',
  standalone: true,
  imports: [
    CommonModule,
    TableModule,
    ButtonModule,
    RouterModule,
    ConfirmDialogModule,
    ToastModule
  ],
  templateUrl: './showquotes.html',
  styleUrls: ['./showquotes.css'],
  encapsulation: ViewEncapsulation.None,
  providers: [ConfirmationService, MessageService]
})
export class Showquotes implements OnInit {
  private refresh$ = new BehaviorSubject<void>(undefined);

  quotes$: Observable<CitaI[]> = this.refresh$.pipe(
    switchMap(() =>
      this.quoteService.getAllQuotes().pipe(
        tap(q => this.quoteService.updateLocalQuotes(q)),
        catchError(err => {
          console.error('Error loading quotes:', err);
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Error al cargar las citas'
          });
          return EMPTY;
        })
      )
    ),
    shareReplay(1)
  );

  loading$: Observable<boolean> = this.quotes$.pipe(
    map(() => false),
    startWith(true)
  );

  constructor(
    private quoteService: QuoteService,
    private confirmationService: ConfirmationService,
    private messageService: MessageService
  ) {}

  ngOnInit(): void {}

  trackById = (_: number, item: CitaI) => item.id;

  deleteQuote(cita: CitaI): void {
    this.confirmationService.confirm({
      message: `¿Está seguro de eliminar la cita #${cita.id}?`,
      header: 'Confirmar eliminación',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.quoteService.deleteQuote(cita.id).pipe(
          tap(() => {
            this.messageService.add({
              severity: 'success',
              summary: 'Éxito',
              detail: 'Cita eliminada correctamente'
            });
            this.refresh$.next();
          }),
          catchError(error => {
            console.error('Error deleting quote:', error);
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: 'Error al eliminar la cita'
            });
            return EMPTY;
          })
        ).subscribe();
      }
    });
  }

  cancelQuote(cita: CitaI): void {
    this.confirmationService.confirm({
      message: `¿Marcar la cita #${cita.id} como CANCELADA?`,
      header: 'Confirmar cancelación',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.quoteService.deleteQuoteAdv(cita.id).pipe(
          tap(() => {
            this.messageService.add({
              severity: 'info',
              summary: 'Actualizado',
              detail: 'Cita marcada como CANCELADA'
            });
            this.refresh$.next();
          }),
          catchError(error => {
            console.error('Error cancelando cita:', error);
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: 'No se pudo cancelar la cita'
            });
            return EMPTY;
          })
        ).subscribe();
      }
    });
  }
}
