export interface TecnologoI {
  id: number;
  nombre: string;
  especialidad: 'RX' | 'TAC' | 'RM';
  telefono: number;
  correo: string;
  status: 'ACTIVATE' | 'INACTIVE';
}
