export type Prioridad = 'BAJA' | 'MEDIA' | 'ALTA' | 'URGENTE';

export interface StudiesI {
  id: number;

  paciente: string;        
  modalidad: string;       
  equipo: string;          
  tecnologo: string;       
  medico: string;          

  fechaHora: string;       
  prioridad: Prioridad;
  motivo: string;          

  // Relación N:N con Etiquetas -> guardamos solo IDs
  etiquetas: number[];
}
