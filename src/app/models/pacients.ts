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

export interface PacientsResponseI{
    id: number;
    nombre: string;
    apellido: string;
    tpdocumento: string;
    sexo?: string;
    documento: number;
    telefono: number;
    eps: string;
    correo: string;
}