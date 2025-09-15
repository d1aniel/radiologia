import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { StudiesI, Prioridad } from '../models/studies';

@Injectable({ providedIn: 'root' })
export class StudiesService {
  private studiesSubject = new BehaviorSubject<StudiesI[]>([
    {
      id: 1,
      paciente: 'Camilo Rodríguez',
      modalidad: 'RX',
      equipo: 'RX-01 Sala A',
      fechaHora: new Date().toISOString(),
      prioridad: 'MEDIA',
      motivo: 'Dolor lumbar posterior a caída',
      tecnologo: 'Laura Martínez',
      medico: 'Dr. Andrés Velásquez',
      etiquetas: ['Columna', 'Trauma']
    }
  ]);

  studies$ = this.studiesSubject.asObservable();
  get value() { return this.studiesSubject.value; }

  getAll(): StudiesI[] { return this.value; }
  getById(id: number)  { return this.value.find(e => e.id === id); }

  add(payload: Omit<StudiesI, 'id'>): StudiesI {
    const nextId = this.value.length ? Math.max(...this.value.map(x => x.id)) + 1 : 1;
    const row: StudiesI = { id: nextId, ...payload };
    this.studiesSubject.next([...this.value, row]);
    return row;
  }

  update(id: number, changes: Partial<StudiesI>): void {
    const updated = this.value.map(e => e.id === id ? { ...e, ...changes, id } : e);
    this.studiesSubject.next(updated);
  }

  remove(id: number): void {
    this.studiesSubject.next(this.value.filter(e => e.id !== id));
  }

  // Búsqueda simple (por si luego quieres filtro global)
  search(term: string): StudiesI[] {
    const t = term.toLowerCase().trim();
    if (!t) return this.value;
    return this.value.filter(e =>
      [
        e.paciente, e.modalidad, e.equipo, e.tecnologo, e.medico,
        e.prioridad, e.motivo, e.etiquetas.join(' ')
      ].some(v => String(v).toLowerCase().includes(t))
    );
  }
}
