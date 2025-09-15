// Reusamos Prioridad y EstadoCita del modelo de modalidad para mantener una sola fuente de verdad
import { Prioridad, EstadoCita } from './agendamodality';

export type EstadoEquipo = 'DISPONIBLE' | 'MANTENIMIENTO';

export interface AgendaEquipoI {
  id: number;

  paciente: string;
  documento: string;           // CC 1.234.567.890 (texto libre)
  modalidad: string;           // 'RX' | 'TAC' | 'RM'
  equipo: string;              // 'RX-01', 'TAC-Sala A', 'RM-1'
  tecnologo: string;           // Tecnólogo asignado
  medico: string;              // Médico radiólogo (si aplica)

  fechaHora: string;           // ISO datetime
  duracionMinutos: number;     // Para métricas (ocupación/slots)
  prioridad: Prioridad;        // BAJA | MEDIA | ALTA | URGENTE
  motivo: string;              // Indicación clínica
  etiquetas: string[];         // chips: ['Urgente','Pediatría',...]

  estado: EstadoCita;          // PROGRAMADA | EN_CURSO | COMPLETADA | CANCELADA

  // (Opcional) estado del equipo en ese bloque
  equipoEstado?: EstadoEquipo; // Mostrar en header del grupo: 'DISPONIBLE' | 'MANTENIMIENTO'
}
