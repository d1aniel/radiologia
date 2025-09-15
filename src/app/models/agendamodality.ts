export type Prioridad = 'BAJA' | 'MEDIA' | 'ALTA' | 'URGENTE';
export type EstadoCita = 'PROGRAMADA' | 'EN_CURSO' | 'COMPLETADA' | 'CANCELADA';

export interface AgendaModalidadI {
  id: number;

  paciente: string;     // "Camilo Rodríguez"
  modalidad: string;    // "RX" | "TAC" | "RM"
  equipo: string;       // "RX-01 Sala A"
  tecnologo: string;    // "Laura Martínez"
  medico: string;       // "Dr. Andrés Velásquez"

  fechaHora: string;    // ISO datetime
  prioridad: Prioridad;
  motivo: string;       // Indicación clínica
  etiquetas: string[];  // ["Trauma", "Columna"]

  estado: EstadoCita;   // "PROGRAMADA" por defecto al crear
}
