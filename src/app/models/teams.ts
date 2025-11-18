export type EstadoTeam = 'DISPONIBLE' | 'MANTENIMIENTO' | 'OCUPADO';

export interface TeamI {
  id: number;
  nombre: string;
  modality_id: number;  
  ubicacion: string;
  estado: EstadoTeam;
  observaciones?: string;
}
