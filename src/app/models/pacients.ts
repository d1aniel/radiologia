export interface PacientsI{
    id: number;
    nombre: string;
    apellido: string;
    tpdocumento: string;
    sexo?: string;
    documento: number;
    telefono: number;
    eps: string;
    correo: string;
    status: "ACTIVATE" | "INACTIVE"

}