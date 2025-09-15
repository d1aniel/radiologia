// MODELO: Studies
export type Prioridad = 'BAJA' | 'MEDIA' | 'ALTA' | 'URGENTE';

export interface StudiesI {
  id: number;

  paciente: string;        // Ej: "Camilo Rodríguez"
  modalidad: string;       // Ej: "RX" | "TAC" | "RM"
  equipo: string;          // Ej: "RX-01 Sala A"
  tecnologo: string;       // Ej: "Laura Martínez"
  medico: string;          // Ej: "Dr. Andrés Velásquez"

  fechaHora: string;       // ISO datetime (new Date().toISOString())
  prioridad: Prioridad;
  motivo: string;          // Indicación clínica

  // Relación N:N con Etiquetas -> guardamos solo IDs
  etiquetas: number[];
}
