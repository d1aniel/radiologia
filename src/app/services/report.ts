import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { InformeI } from '../models/reports';

@Injectable({ providedIn: 'root' })
export class InformeService {
  private informesSubject = new BehaviorSubject<InformeI[]>([
    {
      id: 1,
      estudioId: 1,
      estado: 'BORRADOR',
      cuerpo: 'Paciente con hallazgos compatibles con...',
      medicoId: 1,
      fechaCreacion: new Date().toISOString()
    }
  ]);

  informes$ = this.informesSubject.asObservable();

  get value(): InformeI[] {
    return this.informesSubject.value;
  }

  getByEstudioId(estudioId: number): InformeI | undefined {
    return this.value.find(i => i.estudioId === estudioId);
  }

  addInforme(data: Omit<InformeI, 'id' | 'fechaCreacion'>) {
    const exists = this.getByEstudioId(data.estudioId);
    if (exists) {
      throw new Error('El estudio seleccionado ya tiene un informe.');
    }
    const nextId = this.value.length ? Math.max(...this.value.map(i => i.id)) + 1 : 1;
    const nuevo: InformeI = {
      id: nextId,
      fechaCreacion: new Date().toISOString(),
      ...data
    };
    this.informesSubject.next([...this.value, nuevo]);
    return nuevo;
  }

  updateInforme(id: number, patch: Partial<InformeI>) {
    const list = this.value.map(i => i.id === id ? { ...i, ...patch } : i);
    this.informesSubject.next(list);
  }

  deleteInforme(id: number) {
    this.informesSubject.next(this.value.filter(i => i.id !== id));
  }
}
