// src/app/services/agendateam.ts
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { AgendaEquipoI, EstadoEquipo } from '../models/agendateams';
import { Prioridad, EstadoCita } from '../models/agendamodality';

type Jornada = { start: string; end: string }; // 'HH:mm' local

@Injectable({ providedIn: 'root' })
export class AgendaEquipoService {
  // Datos de ejemplo
  private subject = new BehaviorSubject<AgendaEquipoI[]>([
    {
      id: 1,
      paciente: 'Juan Pérez',
      documento: 'CC 1.234.567.890',
      modalidad: 'RX',
      equipo: 'RX-01',
      tecnologo: 'Carlos Téllez',
      medico: 'Dra. Gómez',
      fechaHora: new Date().toISOString(),
      duracionMinutos: 20,
      prioridad: 'MEDIA',
      motivo: 'Dolor torácico',
      etiquetas: ['Tórax', 'Control'],
      estado: 'PROGRAMADA',
      equipoEstado: 'DISPONIBLE'
    },
    {
      id: 2,
      paciente: 'María González',
      documento: 'CC 2.345.678.901',
      modalidad: 'TAC',
      equipo: 'TAC-Sala A',
      tecnologo: 'Laura Martínez',
      medico: 'Dr. Velásquez',
      fechaHora: new Date(Date.now() + 60 * 60 * 1000).toISOString(),
      duracionMinutos: 30,
      prioridad: 'ALTA',
      motivo: 'Cefalea intensa',
      etiquetas: ['Cráneo', 'Urgente'],
      estado: 'EN_CURSO',
      equipoEstado: 'DISPONIBLE'
    },
    {
      id: 3,
      paciente: 'Pedro Romero',
      documento: 'CC 3.456.789.012',
      modalidad: 'RM',
      equipo: 'RM-1',
      tecnologo: 'Ana Suárez',
      medico: 'Dr. Prieto',
      fechaHora: new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString(),
      duracionMinutos: 45,
      prioridad: 'MEDIA',
      motivo: 'Lumbalgia crónica',
      etiquetas: ['Columna'],
      estado: 'PROGRAMADA',
      equipoEstado: 'MANTENIMIENTO'
    }
  ]);

  agenda$ = this.subject.asObservable();
  get value() { return this.subject.value; }

  // CRUD básico
  getAll(): AgendaEquipoI[] { return this.value; }
  getById(id: number) { return this.value.find(x => x.id === id); }

  add(payload: Omit<AgendaEquipoI, 'id'>): AgendaEquipoI {
    const nextId = this.value.length ? Math.max(...this.value.map(x => x.id)) + 1 : 1;
    const row: AgendaEquipoI = { id: nextId, ...payload };
    this.subject.next([...this.value, row]);
    return row;
  }

  update(id: number, changes: Partial<AgendaEquipoI>) {
    this.subject.next(this.value.map(x => x.id === id ? { ...x, ...changes, id } : x));
  }

  remove(id: number) {
    this.subject.next(this.value.filter(x => x.id !== id));
  }

  // Listados y filtros
  listByEquipo(equipo: string, fecha?: Date, estado?: EstadoCita, modalidad?: string): AgendaEquipoI[] {
    const sameDay = (iso: string) => {
      if (!fecha) return true;
      const d = new Date(iso);
      return d.getFullYear() === fecha.getFullYear()
          && d.getMonth() === fecha.getMonth()
          && d.getDate() === fecha.getDate();
    };
    return this.value.filter(x =>
      x.equipo === equipo &&
      sameDay(x.fechaHora) &&
      (!estado || x.estado === estado) &&
      (!modalidad || x.modalidad === modalidad)
    );
  }

  search(term: string): AgendaEquipoI[] {
    const t = term.toLowerCase().trim();
    if (!t) return this.value;
    return this.value.filter(e =>
      [
        e.paciente, e.documento, e.modalidad, e.equipo, e.tecnologo, e.medico,
        e.prioridad, e.motivo, e.estado, e.etiquetas.join(' ')
      ].some(v => String(v).toLowerCase().includes(t))
    );
  }

  uniqueEquipos(): string[] {
    return Array.from(new Set(this.value.map(x => x.equipo)));
  }
  uniqueModalidades(): string[] {
    return Array.from(new Set(this.value.map(x => x.modalidad)));
  }
  uniqueEstados(): EstadoCita[] {
    return Array.from(new Set(this.value.map(x => x.estado))) as EstadoCita[];
  }
  equipoEstadoActual(equipo: string): EstadoEquipo | undefined {
    // Último estado reportado para ese equipo en el día
    const hoy = new Date();
    const list = this.listByEquipo(equipo, hoy);
    return list.at(-1)?.equipoEstado;
  }

  // ====== Métricas rápidas ======
  // Config por defecto (puedes mover a settings)
  private defaultJornada: Jornada = { start: '07:00', end: '19:00' };
  private defaultSlotMin = 30;

  ocupacionEquipo(equipo: string, fecha: Date, slotMin = this.defaultSlotMin, jornada: Jornada = this.defaultJornada) {
    const [sH, sM] = jornada.start.split(':').map(Number);
    const [eH, eM] = jornada.end.split(':').map(Number);

    const start = new Date(fecha);
    start.setHours(sH, sM, 0, 0);
    const end = new Date(fecha);
    end.setHours(eH, eM, 0, 0);

    const totalSlots = Math.max(0, Math.floor((end.getTime() - start.getTime()) / (slotMin * 60 * 1000)));
    const citas = this.listByEquipo(equipo, fecha).length;

    const ocupacionPct = totalSlots ? Math.min(100, Math.round((citas / totalSlots) * 100)) : 0;
    return { totalSlots, citas, ocupacionPct };
  }

  proximoEspacioLibre(equipo: string, fecha: Date, slotMin = this.defaultSlotMin, jornada: Jornada = this.defaultJornada): Date | null {
    const [sH, sM] = jornada.start.split(':').map(Number);
    const [eH, eM] = jornada.end.split(':').map(Number);

    const start = new Date(fecha);
    start.setHours(sH, sM, 0, 0);
    const end = new Date(fecha);
    end.setHours(eH, eM, 0, 0);

    const citas = this.listByEquipo(equipo, fecha).sort((a, b) => +new Date(a.fechaHora) - +new Date(b.fechaHora));

    // Construir slots
    const slots: Date[] = [];
    for (let t = new Date(start); t < end; t = new Date(t.getTime() + slotMin * 60 * 1000)) {
      slots.push(new Date(t));
    }

    // Marca ocupados por inicio exacto de la cita (simple)
    const ocupados = new Set(citas.map(c => new Date(c.fechaHora).toISOString().slice(0, 16))); // YYYY-MM-DDTHH:MM
    for (const s of slots) {
      const k = s.toISOString().slice(0, 16);
      if (!ocupados.has(k)) return s;
    }
    return null;
  }
}
