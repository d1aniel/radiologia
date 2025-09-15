// src/app/services/cita.ts
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { CitaI, EstadoCita } from '../models/quotes';

@Injectable({ providedIn: 'root' })
export class CitaService {
  private citasSubject = new BehaviorSubject<CitaI[]>([
    {
      id: 1,
      paciente: 'Camilo Rodríguez',
      modalidad: 'RX',
      equipo: 'RX-01 Sala A',
      tecnologo: 'Laura Martínez',
      fechaHora: new Date().toISOString(),
      motivo: 'Dolor lumbar posterior a caída',
      estado: 'PENDIENTE'
    }
  ]);

  citas$ = this.citasSubject.asObservable();
  private get value() { return this.citasSubject.value; }

  getAll(): CitaI[] { return this.value; }
  getById(id: number) { return this.value.find(x => x.id === id); }

  add(payload: Omit<CitaI, 'id'>): CitaI {
    const nextId = this.value.length ? Math.max(...this.value.map(x => x.id)) + 1 : 1;
    const row: CitaI = { id: nextId, ...payload };
    this.citasSubject.next([...this.value, row]);
    return row;
  }

  update(id: number, changes: Partial<CitaI>): void {
    const updated = this.value.map(e => e.id === id ? { ...e, ...changes, id } : e);
    this.citasSubject.next(updated);
  }

  remove(id: number): void {
    this.citasSubject.next(this.value.filter(e => e.id !== id));
  }

  search(term: string): CitaI[] {
    const t = term.toLowerCase().trim();
    if (!t) return this.value;
    return this.value.filter(e =>
      [
        e.paciente, e.modalidad, e.equipo, e.tecnologo,
        e.motivo, e.estado
      ].some(v => String(v).toLowerCase().includes(t))
    );
  }
}
