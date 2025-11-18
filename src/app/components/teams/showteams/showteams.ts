
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

import { TeamI } from '../../../models/teams';
import { TeamService } from '../../../services/team';   

@Component({
  selector: 'app-showteams',
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
  templateUrl: './showteams.html',
  styleUrls: ['./showteams.css'],
  encapsulation: ViewEncapsulation.None,
  providers: [ConfirmationService, MessageService]
})
export class Showteams implements OnInit {
  
  private refresh$ = new BehaviorSubject<void>(undefined);

  
  teams$: Observable<TeamI[]> = this.refresh$.pipe(
    switchMap(() =>
      this.teamService.getAllTeams().pipe(
        tap(t => this.teamService.updateLocalTeams(t)),
        catchError(err => {
          console.error('Error loading teams:', err);
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Error al cargar los equipos'
          });
          return EMPTY;
        })
      )
    ),
    shareReplay(1)
  );

  
  loading$: Observable<boolean> = this.teams$.pipe(
    map(() => false),
    startWith(true)
  );

  constructor(
    private teamService: TeamService,
    private confirmationService: ConfirmationService,
    private messageService: MessageService
  ) {}

  ngOnInit(): void {
    
  }

  trackById = (_: number, item: TeamI) => item.id;

  severity(estado: TeamI['estado']) {
    switch (estado) {
      case 'DISPONIBLE':    return 'success';
      case 'MANTENIMIENTO': return 'warn';
      default:              return 'danger'; 
    }
  }

  
  deleteTeam(team: TeamI): void {
    this.confirmationService.confirm({
      message: `¿Está seguro de eliminar el equipo "${team.nombre}"?`,
      header: 'Confirmar eliminación',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        if (team.id) {
          this.teamService.deleteTeam(team.id).pipe(
            tap(() => {
              this.messageService.add({
                severity: 'success',
                summary: 'Éxito',
                detail: 'Equipo eliminado correctamente'
              });
              this.refresh$.next(); 
            }),
            catchError(error => {
              console.error('Error deleting team:', error);
              this.messageService.add({
                severity: 'error',
                summary: 'Error',
                detail: 'Error al eliminar el equipo'
              });
              return EMPTY;
            })
          ).subscribe();
        }
      }
    });
  }

  
  deleteTeamAdv(team: TeamI): void {
    this.confirmationService.confirm({
      message: `¿Marcar el equipo "${team.nombre}" como MANTENIMIENTO?`,
      header: 'Confirmar actualización',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        if (team.id) {
          this.teamService.deleteTeamAdv(team.id).pipe(
            tap(() => {
              this.messageService.add({
                severity: 'info',
                summary: 'Actualizado',
                detail: 'Equipo marcado como MANTENIMIENTO'
              });
              this.refresh$.next(); 
            }),
            catchError(error => {
              console.error('Error marcando MANTENIMIENTO:', error);
              this.messageService.add({
                severity: 'error',
                summary: 'Error',
                detail: 'No se pudo marcar como MANTENIMIENTO'
              });
              return EMPTY;
            })
          ).subscribe();
        }
      }
    });
  }
}
