export type EstadoCita = 'PENDIENTE' | 'CONFIRMADA' | 'ATENDIDA' | 'CANCELADA';

export interface CitaI {
  id: number;

  paciente: string;      
  modalidad: string;     
  equipo: string;        
  tecnologo: string;     

  fechaHora: string;     
  motivo: string;     
  estado: EstadoCita;    
}
