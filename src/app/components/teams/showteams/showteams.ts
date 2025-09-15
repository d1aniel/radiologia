// src/app/features/teams/showteams.ts
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { TagModule } from 'primeng/tag';
import { RouterModule } from '@angular/router';
import { Observable } from 'rxjs';

import { TeamsService } from '../../../services/team';
import { TeamI } from '../../../models/teams';

@Component({
  selector: 'app-showteams',
  standalone: true,
  imports: [CommonModule, TableModule, ButtonModule, RouterModule, TagModule],
  templateUrl: './showteams.html',
  styleUrls: ['./showteams.css']
})
export class Showteams {
  teams$: Observable<TeamI[]>;
  constructor(private teamsService: TeamsService) {
    this.teams$ = this.teamsService.teams$;
  }

  severity(estado: TeamI['estado']) {
    switch (estado) {
      case 'DISPONIBLE':    return 'success';
      case 'MANTENIMIENTO': return 'warn';
      default:              return 'danger'; // OCUPADO
    }
  }

  delete(row: TeamI) { this.teamsService.remove(row.id); }
}
