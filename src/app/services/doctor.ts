import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { MedicoI } from '../models/doctors';

@Injectable({ providedIn: 'root' })
export class MedicosService {
  private medicosSubject = new BehaviorSubject<MedicoI[]>([
    {
      id: 1,
      nombre: 'Ana Pineda',
      especialidad: 'Radiología General',
      telefono: 3001234567,
      correo: 'ana.pineda@clinic.com',
      registro: 'RM-12345',
      status: 'ACTIVATE'
    },
    {
      id: 2,
      nombre: 'Jorge Arango',
      especialidad: 'Neurorradiología',
      telefono: 3159876543,
      correo: 'jorge.arango@clinic.com',
      status: 'INACTIVE'
    }
  ]);

  medicos$ = this.medicosSubject.asObservable();

  get value(): MedicoI[] {
    return this.medicosSubject.value;
  }

  addMedico(medico: Omit<MedicoI, 'id'>) {
    const list = this.value;
    const nextId = list.length ? Math.max(...list.map(m => m.id)) + 1 : 1;
    const nuevo: MedicoI = { id: nextId, ...medico };
    this.medicosSubject.next([...list, nuevo]);
  }

  deleteMedico(id: number) {
    this.medicosSubject.next(this.value.filter(m => m.id !== id));
  }
}
