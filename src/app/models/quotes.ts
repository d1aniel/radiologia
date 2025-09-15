// src/app/models/cita.ts
export type EstadoCita = 'PENDIENTE' | 'CONFIRMADA' | 'ATENDIDA' | 'CANCELADA';

export interface CitaI {
  id: number;

  // Relacionados (puedes cambiar a IDs si luego usas catálogos)
  paciente: string;      // Ej: "Camilo Rodríguez"
  modalidad: string;     // Ej: "RX", "TAC", "RM"
  equipo: string;        // Ej: "RX-01 Sala A"
  tecnologo: string;     // Ej: "Laura Martínez"

  fechaHora: string;     // ISO datetime (new Date().toISOString())
  motivo: string;        // Indicación / razón del estudio
  estado: EstadoCita;    // PENDIENTE | CONFIRMADA | ATENDIDA | CANCELADA
}
