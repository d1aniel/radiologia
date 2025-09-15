export type Prioridad = 'BAJA' | 'MEDIA' | 'ALTA' | 'URGENTE';

export interface StudiesI {
  id: number;

  // Relacionados (puedes cambiar a IDs si ya tienes catálogos)
  paciente: string;        // Ej: "Camilo Rodríguez"
  modalidad: string;       // Ej: "RX", "TAC", "RM"
  equipo: string;          // Ej: "RX-01 Sala A"
  tecnologo: string;       // Ej: "Juan Pérez"
  medico: string;          // Ej: "Dra. Gómez"

  fechaHora: string;       // ISO datetime (ej: new Date().toISOString())
  prioridad: Prioridad;    
  motivo: string;          // Indicación clínica
  etiquetas: string[];     // p. ej., ["Trauma", "Columna", "Reporte Rápido"]
}
