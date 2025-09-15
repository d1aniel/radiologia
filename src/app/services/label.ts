import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { LabelsI } from '../models/labels';

@Injectable({ providedIn: 'root' })
export class TagsService {
  private tagsSubject = new BehaviorSubject<LabelsI[]>([
    { id: 1, nombre: 'Urgente', descripcion: 'Atención prioritaria', status: 'ACTIVATE' },
    { id: 2, nombre: 'Control', descripcion: 'Seguimiento de tratamiento', status: 'ACTIVATE' },
    { id: 3, nombre: 'Oncología', descripcion: 'Pacientes oncológicos', status: 'INACTIVE' },
  ]);

  tags$ = this.tagsSubject.asObservable();

  get value(): LabelsI[] {
    return this.tagsSubject.value;
  }

  addTag(tag: Omit<LabelsI, 'id'>) {
    const list = this.value;
    const nextId = list.length ? Math.max(...list.map(t => t.id)) + 1 : 1;
    const newTag: LabelsI = { id: nextId, ...tag };
    this.tagsSubject.next([...list, newTag]);
  }

  deleteTag(id: number) {
    this.tagsSubject.next(this.value.filter(t => t.id !== id));
  }
}
