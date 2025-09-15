export interface MedicoI {
  id: number;
  nombre: string;
  especialidad: string;
  telefono: number;
  correo: string;
  registro?: string;
  status: 'ACTIVATE' | 'INACTIVE';
}
