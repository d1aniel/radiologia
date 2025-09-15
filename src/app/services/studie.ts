import { Injectable, inject } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { StudiesI } from '../models/studies';
import { TagsService } from './label';
import { LabelsI } from '../models/labels';

@Injectable({ providedIn: 'root' })
export class StudiesService {
  private tagsService = inject(TagsService);

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
      etiquetas: [2, 1]
    }
  ]);

  studies$ = this.studiesSubject.asObservable();
  get value(): StudiesI[] { return this.studiesSubject.value; }

  getAll(): StudiesI[] { return this.value; }

  getById(id: number): StudiesI | undefined {
    return this.value.find(e => e.id === id);
  }

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

  setLabels(idEstudio: number, etiquetaIds: number[]): void {
    const updated = this.value.map(e => e.id === idEstudio ? { ...e, etiquetas: [...etiquetaIds] } : e);
    this.studiesSubject.next(updated);
  }

  addLabel(idEstudio: number, etiquetaId: number): void {
    const updated = this.value.map(e => {
      if (e.id !== idEstudio) return e;
      const set = new Set<number>(e.etiquetas ?? []);
      set.add(etiquetaId);
      return { ...e, etiquetas: Array.from(set) };
    });
    this.studiesSubject.next(updated);
  }

  removeLabel(idEstudio: number, etiquetaId: number): void {
    const updated = this.value.map(e => {
      if (e.id !== idEstudio) return e;
      return { ...e, etiquetas: (e.etiquetas ?? []).filter(id => id !== etiquetaId) };
    });
    this.studiesSubject.next(updated);
  }

  search(term: string): StudiesI[] {
    const t = term.toLowerCase().trim();
    if (!t) return this.value;

    const etiquetasMap = new Map<number, string>();
    this.tagsService.value.forEach((tag: LabelsI) => {
      etiquetasMap.set(tag.id, tag.nombre);
    });

    return this.value.filter(e => {
      const campos = [
        e.paciente, e.modalidad, e.equipo, e.tecnologo, e.medico,
        e.prioridad, e.motivo
      ].map(v => String(v).toLowerCase());

      const etiquetasNombres = (e.etiquetas ?? [])
        .map(id => (etiquetasMap.get(id) || '').toLowerCase())
        .filter(Boolean);

      return [...campos, ...etiquetasNombres].some(v => v.includes(t));
    });
  }
}
