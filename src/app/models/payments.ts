export type MetodoPago = 'EFECTIVO' | 'TARJETA' | 'TRANSFERENCIA' | 'OTRO';
export type EstadoPago = 'PAID' | 'PENDING' | 'VOID';

export interface PaymentI {
  id: number;
  pacienteId: number;        // relación con PacientsI
  estudioId?: number | null; // si aún no ligas estudio, puede ir null
  monto: number;
  metodo: MetodoPago;
  fecha: string;             // ISO string (YYYY-MM-DD) o Date.toISOString().slice(0,10)
  estado: EstadoPago;        // se setea automáticamente a 'PAID' al crear
}
