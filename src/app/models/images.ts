export type TipoImagen = 'DICOM' | 'JPG' | 'PNG' | 'Serie';

export interface ImageI {
  id: number;
  estudioId: number;    // FK al estudio
  tipo: TipoImagen;
  url: string;          // blob URL o ruta guardada
  nombreArchivo: string;
  tamanoBytes: number;
  serie?: string | null;
  orden?: number | null;
  fechaCarga: string;   // ISO string
}
