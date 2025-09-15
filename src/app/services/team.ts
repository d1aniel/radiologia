// src/app/services/team.ts
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { TeamI, EstadoTeam } from '../models/teams';

@Injectable({ providedIn: 'root' })
export class TeamsService {
  private teamsSubject = new BehaviorSubject<TeamI[]>([
    {
      id: 1,
      nombre: 'RX-01 Sala A',
      modalidad: 'RX',
      ubicacion: 'Sala A - Piso 1',
      estado: 'DISPONIBLE',
      observaciones: 'Calibración realizada el 10/09'
    },
    {
      id: 2,
      nombre: 'TAC-02',
      modalidad: 'TAC',
      ubicacion: 'Sala TAC - Piso 2',
      estado: 'MANTENIMIENTO',
      observaciones: 'En revisión por ruido en gantry'
    }
  ]);

  teams$ = this.teamsSubject.asObservable();
  get value() { return this.teamsSubject.value; }

  getAll(): TeamI[] { return this.value; }
  getById(id: number) { return this.value.find(t => t.id === id); }

  add(payload: Omit<TeamI, 'id'>): TeamI {
    const nextId = this.value.length ? Math.max(...this.value.map(x => x.id)) + 1 : 1;
    const row: TeamI = { id: nextId, ...payload };
    this.teamsSubject.next([...this.value, row]);
    return row;
  }

  update(id: number, changes: Partial<TeamI>): void {
    const updated = this.value.map(t => t.id === id ? { ...t, ...changes, id } : t);
    this.teamsSubject.next(updated);
  }

  remove(id: number): void {
    this.teamsSubject.next(this.value.filter(t => t.id !== id));
  }

  // Búsqueda simple
  search(term: string): TeamI[] {
    const q = term.toLowerCase().trim();
    if (!q) return this.value;
    return this.value.filter(t =>
      [t.nombre, t.modalidad, t.ubicacion, t.estado, t.observaciones ?? '']
        .some(v => String(v).toLowerCase().includes(q))
    );
  }
}
