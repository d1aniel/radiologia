// src/app/services/agenda-modalidad.ts
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { AgendaModalidadI, Prioridad, EstadoCita } from '../models/agendamodality';

@Injectable({ providedIn: 'root' })
export class AgendaModalidadService {
  private subject = new BehaviorSubject<AgendaModalidadI[]>([
    {
      id: 1,
      paciente: 'Juan Pérez',
      modalidad: 'RX',
      equipo: 'RX-01',
      fechaHora: new Date().toISOString(),
      prioridad: 'MEDIA',
      motivo: 'Dolor torácico',
      tecnologo: 'Carlos Téllez',
      medico: 'Dra. Gómez',
      etiquetas: ['Tórax', 'Control'],
      estado: 'PROGRAMADA'
    },
    {
      id: 2,
      paciente: 'María González',
      modalidad: 'TAC',
      equipo: 'TAC-Philips 64',
      fechaHora: new Date(Date.now() + 60 * 60 * 1000).toISOString(),
      prioridad: 'ALTA',
      motivo: 'Cefalea intensa',
      tecnologo: 'Laura Martínez',
      medico: 'Dr. Velásquez',
      etiquetas: ['Cráneo'],
      estado: 'EN_CURSO'
    }
  ]);

  agenda$ = this.subject.asObservable();
  get value() { return this.subject.value; }

  getAll(): AgendaModalidadI[] { return this.value; }
  getById(id: number) { return this.value.find(x => x.id === id); }

  add(payload: Omit<AgendaModalidadI, 'id'>): AgendaModalidadI {
    const nextId = this.value.length ? Math.max(...this.value.map(x => x.id)) + 1 : 1;
    const row: AgendaModalidadI = { id: nextId, ...payload };
    this.subject.next([...this.value, row]);
    return row;
  }

  update(id: number, changes: Partial<AgendaModalidadI>) {
    this.subject.next(this.value.map(x => x.id === id ? { ...x, ...changes, id } : x));
  }

  remove(id: number) {
    this.subject.next(this.value.filter(x => x.id !== id));
  }

  listByModalidad(modalidad: string, fecha?: Date): AgendaModalidadI[] {
    const sameDay = (iso: string) => {
      if (!fecha) return true;
      const d = new Date(iso);
      return d.getFullYear() === fecha.getFullYear()
        && d.getMonth() === fecha.getMonth()
        && d.getDate() === fecha.getDate();
    };
    return this.value.filter(x => x.modalidad === modalidad && sameDay(x.fechaHora));
  }

  // búsqueda simple para filtro global
  search(term: string): AgendaModalidadI[] {
    const t = term.toLowerCase().trim();
    if (!t) return this.value;
    return this.value.filter(e =>
      [
        e.paciente, e.modalidad, e.equipo, e.tecnologo, e.medico,
        e.prioridad, e.motivo, e.estado, e.etiquetas.join(' ')
      ].some(v => String(v).toLowerCase().includes(t))
    );
  }

  // utilidades
  uniqueModalidades(): string[] {
    return Array.from(new Set(this.value.map(x => x.modalidad)));
  }
}
