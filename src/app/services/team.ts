
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { map } from 'rxjs/operators';

import { TeamI } from '../models/teams';          
import { AuthService } from '../services/auth'; 

@Injectable({
  providedIn: 'root'
})
export class TeamService {
  private baseUrl = 'http://localhost:4000/api/equipos'; 
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

  
  getAllTeams(): Observable<TeamI[]> {
    return this.http
      .get<{ teams: TeamI[] }>(this.baseUrl, { headers: this.getHeaders() })
      .pipe(map(resp => resp.teams));
  }

  
  getTeamById(id: number | string): Observable<TeamI> {
    return this.http
      .get<{ team: TeamI }>(`${this.baseUrl}/${id}`, { headers: this.getHeaders() })
      .pipe(map(resp => resp.team));
  }

  
  createTeam(team: Omit<TeamI, 'id'>): Observable<TeamI> {
    return this.http.post<TeamI>(this.baseUrl, team, { headers: this.getHeaders() });
  }

  
  updateTeam(id: number | string, team: Partial<TeamI>): Observable<TeamI> {
  return this.http.patch<TeamI>(`${this.baseUrl}/${id}`, team, { headers: this.getHeaders() });
}


  
  deleteTeam(id: number | string): Observable<{ message: string }> {
    return this.http.delete<{ message: string }>(`${this.baseUrl}/${id}`, {
      headers: this.getHeaders()
    });
  }

  
  deleteTeamAdv(id: number | string): Observable<{ message: string }> {
    return this.http.delete<{ message: string }>(`${this.baseUrl}/${id}/logic`, {
      headers: this.getHeaders()
    });
  }

  
  updateLocalTeams(teams: TeamI[]): void {
    this.teamsSubject.next(teams);
  }

  
  refreshTeams(): void {
    this.getAllTeams().subscribe(teams => {
      this.teamsSubject.next(teams);
    });
  }
}
