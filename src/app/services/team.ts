// src/app/services/team.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { map } from 'rxjs/operators';

import { TeamI } from '../models/teams';          // ajusta la ruta si es distinta
import { AuthService } from '../services/auth'; // igual que en PatientService

@Injectable({
  providedIn: 'root'
})
export class TeamService {
  private baseUrl = 'http://localhost:4000/api/equipos'; // ajusta si tu ruta es otra
  private teamsSubject = new BehaviorSubject<TeamI[]>([]);
  public teams$ = this.teamsSubject.asObservable();

  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) {}

  private getHeaders(): HttpHeaders {
    let headers = new HttpHeaders();
    const token = this.authService.getToken();
    if (token) {
      headers = headers.set('Authorization', `Bearer ${token}`);
    }
    return headers;
  }

  // GET /teams  → backend responde { teams: [...] }
  getAllTeams(): Observable<TeamI[]> {
    return this.http
      .get<{ teams: TeamI[] }>(this.baseUrl, { headers: this.getHeaders() })
      .pipe(map(resp => resp.teams));
  }

  // GET /teams/:id → backend responde { team: {...} }
  getTeamById(id: number | string): Observable<TeamI> {
    return this.http
      .get<{ team: TeamI }>(`${this.baseUrl}/${id}`, { headers: this.getHeaders() })
      .pipe(map(resp => resp.team));
  }

  // POST /teams
  createTeam(team: Omit<TeamI, 'id'>): Observable<TeamI> {
    return this.http.post<TeamI>(this.baseUrl, team, { headers: this.getHeaders() });
  }

  // PATCH /teams/:id
  updateTeam(id: number | string, team: Partial<TeamI>): Observable<TeamI> {
  return this.http.patch<TeamI>(`${this.baseUrl}/${id}`, team, { headers: this.getHeaders() });
}


  // DELETE físico /teams/:id
  deleteTeam(id: number | string): Observable<{ message: string }> {
    return this.http.delete<{ message: string }>(`${this.baseUrl}/${id}`, {
      headers: this.getHeaders()
    });
  }

  // DELETE lógico /teams/:id/logic  (según tu controlador deleteTeamAdv)
  deleteTeamAdv(id: number | string): Observable<{ message: string }> {
    return this.http.delete<{ message: string }>(`${this.baseUrl}/${id}/logic`, {
      headers: this.getHeaders()
    });
  }

  // Estado local
  updateLocalTeams(teams: TeamI[]): void {
    this.teamsSubject.next(teams);
  }

  // Refrescar desde backend y actualizar el BehaviorSubject
  refreshTeams(): void {
    this.getAllTeams().subscribe(teams => {
      this.teamsSubject.next(teams);
    });
  }
}
