import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { ImageI } from '../models/images';

@Injectable({ providedIn: 'root' })
export class ImagesService {
  private imagesSubject = new BehaviorSubject<ImageI[]>([]);
  images$ = this.imagesSubject.asObservable();

  get value(): ImageI[] {
    return this.imagesSubject.value;
  }

  addImage(img: Omit<ImageI, 'id' | 'fechaCarga'>) {
    const list = this.value;
    const nextId = list.length ? Math.max(...list.map(i => i.id)) + 1 : 1;
    const fechaCarga = new Date().toISOString();
    const newImg: ImageI = { id: nextId, fechaCarga, ...img };
    this.imagesSubject.next([...list, newImg]);
  }

  deleteImage(id: number) {
    this.imagesSubject.next(this.value.filter(i => i.id !== id));
  }
}
