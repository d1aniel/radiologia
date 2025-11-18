export type EstadoCita = 'PENDIENTE' | 'CONFIRMADA' | 'ATENDIDA' | 'CANCELADA';

export interface CitaI {
  id: number;

  patient_id: number;          
  technologist_id: number;     
  equipo: string;        
  tecnologo: string;     

  fechaHora: string;     
  motivo: string;     
  estado: EstadoCita;    
}
