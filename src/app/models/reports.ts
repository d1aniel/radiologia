export type InformeEstado = 'BORRADOR' | 'FIRMADO';

export interface InformeI {
  id: number;
  estudioId: number;       
  estado: InformeEstado;   
  cuerpo: string;          
  medicoId: number;        
  fechaCreacion: string;   
}
