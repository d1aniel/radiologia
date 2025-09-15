import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { TecnologoI } from '../models/technologists';

@Injectable({ providedIn: 'root' })
export class TecnologosService {
  private tecnologosSubject = new BehaviorSubject<TecnologoI[]>([
    {
      id: 1,
      nombre: 'Laura Gómez',
      especialidad: 'RX',
      telefono: 3001112233,
      correo: 'laura.gomez@clinic.com',
      status: 'ACTIVATE'
    },
    {
      id: 2,
      nombre: 'Carlos Díaz',
      especialidad: 'TAC',
      telefono: 3152223344,
      correo: 'carlos.diaz@clinic.com',
      status: 'INACTIVE'
    }
  ]);

  tecnologos$ = this.tecnologosSubject.asObservable();

  get value(): TecnologoI[] {
    return this.tecnologosSubject.value;
  }

  addTecnologo(tecnologo: Omit<TecnologoI, 'id'>) {
    const list = this.value;
    const nextId = list.length ? Math.max(...list.map(t => t.id)) + 1 : 1;
    const nuevo: TecnologoI = { id: nextId, ...tecnologo };
    this.tecnologosSubject.next([...list, nuevo]);
  }

  deleteTecnologo(id: number) {
    this.tecnologosSubject.next(this.value.filter(t => t.id !== id));
  }
}
