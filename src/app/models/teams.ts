export type EstadoTeam = 'DISPONIBLE' | 'MANTENIMIENTO' | 'OCUPADO';

export interface TeamI {
  id: number;
  nombre: string;        // Nombre/Identificador (p.ej. "RX-01 Sala A")
  modalidad: string;     // RX | TAC | RM (string como en Studies)
  ubicacion: string;     // p.ej., "Sala A - Piso 1"
  estado: EstadoTeam;    // Disponible/Mantenimiento/Ocupado
  observaciones?: string;
}
