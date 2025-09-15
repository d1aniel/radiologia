import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { ModalidadI } from '../models/modalities';

@Injectable({ providedIn: 'root' })
export class ModalidadService {
  private subject = new BehaviorSubject<ModalidadI[]>([
    { id: 1, nombre: 'RX',  descripcion: 'Radiografía convencional', activa: true },
    { id: 2, nombre: 'TAC', descripcion: 'Tomografía computarizada', activa: true },
    { id: 3, nombre: 'RM',  descripcion: 'Resonancia magnética',    activa: false },
  ]);

  modalidades$ = this.subject.asObservable();
  private get value() { return this.subject.value; }

  getAll(): ModalidadI[] { return this.value; }
  getById(id: number) { return this.value.find(m => m.id === id); }

  add(payload: Omit<ModalidadI, 'id'>): ModalidadI {
    const nextId = this.value.length ? Math.max(...this.value.map(x => x.id)) + 1 : 1;
    const row: ModalidadI = { id: nextId, ...payload };
    this.subject.next([...this.value, row]);
    return row;
  }

  update(id: number, changes: Partial<ModalidadI>): void {
    const updated = this.value.map(m => m.id === id ? { ...m, ...changes, id } : m);
    this.subject.next(updated);
  }

  remove(id: number): void {
    this.subject.next(this.value.filter(m => m.id !== id));
  }
}
