export type EstadoTeam = 'DISPONIBLE' | 'MANTENIMIENTO' | 'OCUPADO';

export interface TeamI {
  id: number;
  nombre: string;        
  modalidad: string;     
  ubicacion: string;     
  estado: EstadoTeam;    
  observaciones?: string;
}
