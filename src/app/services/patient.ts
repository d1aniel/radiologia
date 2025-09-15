import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { PacientsI } from '../models/pacients';

@Injectable({ providedIn: 'root' })
export class PatientsService {
  private patientsSubject = new BehaviorSubject<PacientsI[]>([
    {
      id: 1,
      nombre: 'Camilo',
      apellido: 'Rodriguez',
      tpdocumento: 'cedula',
      documento: 1193354149,
      sexo: 'Masculino',
      telefono: 3113644663,
      eps: 'Sanitas',
      correo: 'crodriguez@gmail.com',
      status: 'ACTIVATE'
    },
    {
      id: 2,
      nombre: 'Maria',
      apellido: 'Brito',
      tpdocumento: 'cedula',
      documento: 56059451,
      sexo: 'Femenino',
      telefono: 3014962256,
      eps: 'Sura',
      correo: 'mbrito@gmail.com',
      status: 'INACTIVE'
    }
  ]);

  patients$ = this.patientsSubject.asObservable();

  get value(): PacientsI[] {
    return this.patientsSubject.value;
  }

  addPatient(patient: Omit<PacientsI, 'id'>) {
    const patients = this.value;
    const nextId = patients.length ? Math.max(...patients.map(p => p.id)) + 1 : 1;
    const newPatient: PacientsI = { id: nextId, ...patient };
    this.patientsSubject.next([...patients, newPatient]);
  }

  deletePatient(id: number) {
    this.patientsSubject.next(this.value.filter(p => p.id !== id));
  }
}
