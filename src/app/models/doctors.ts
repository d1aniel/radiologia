export interface MedicoI {
  id: number;
  nombre: string;
  especialidad: string;
  telefono: string;
  correo: string;
  registro?: string;
  status: 'ACTIVATE' | 'INACTIVE';
}
