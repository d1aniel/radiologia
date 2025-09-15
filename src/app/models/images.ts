export type TipoImagen = 'DICOM' | 'JPG' | 'PNG' | 'Serie';

export interface ImageI {
  id: number;
  estudioId: number;    
  tipo: TipoImagen;
  url: string;          
  nombreArchivo: string;
  tamanoBytes: number;
  serie?: string | null;
  orden?: number | null;
  fechaCarga: string;   
}
