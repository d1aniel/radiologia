export type MetodoPago = 'EFECTIVO' | 'TARJETA' | 'TRANSFERENCIA' | 'OTRO';
export type EstadoPago = 'PAID' | 'PENDING' | 'VOID';

export interface PaymentI {
  id: number;
  pacienteId: number;       
  estudioId?: number | null; 
  monto: number;
  metodo: MetodoPago;
  fecha: string;             
  estado: EstadoPago;        
}
