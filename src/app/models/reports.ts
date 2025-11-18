export type InformeEstado = 'BORRADOR' | 'FIRMADO';

export interface InformeCreateI {
  estudio_id: number;
  estado: InformeEstado;
  cuerpo: string;
  medico_id: number;
}

export interface InformeI extends InformeCreateI {
  id: number;
  fechaCreacion: string;
}
