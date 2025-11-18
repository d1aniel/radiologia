export interface TecnologoI {
  id: number;
  nombre: string;
  especialidad: 'RX' | 'TAC' | 'RM';
  telefono: string; 
  correo: string;
  status: 'ACTIVE' | 'INACTIVE'; 
}
