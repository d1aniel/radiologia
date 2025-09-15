export type InformeEstado = 'BORRADOR' | 'FIRMADO';

export interface InformeI {
  id: number;
  estudioId: number;       // FK único (1:1 con Estudio)
  estado: InformeEstado;   // Borrador/Firmado
  cuerpo: string;          // texto largo / markdown
  medicoId: number;        // quien firma
  fechaCreacion: string;   // ISO string
}
