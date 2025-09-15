export interface LabelsI {
  id: number;
  nombre: string;
  descripcion?: string;
  status: 'ACTIVATE' | 'INACTIVE';
}
