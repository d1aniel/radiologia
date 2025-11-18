

export type Prioridad = 'BAJA' | 'MEDIA' | 'ALTA' | 'URGENTE';


export interface StudyCreateI {
  
  patient_id: number;
  modality_id: number;
  team_id: number;

  
  technologist_id?: number | null;
  medico_id?: number | null;
  quote_id?: number | null;

  
  fechaHora: string;            
  prioridad: Prioridad;         
  motivo: string;
  status?: 'ACTIVE' | 'INACTIVE';

  
  labels?: number[];
}


export interface StudyReadI {
  id: number;

  
  patient_id: number;
  modality_id: number;
  team_id: number;
  technologist_id: number | null;
  medico_id: number | null;
  quote_id: number | null;

  
  fechaHora: string;            
  prioridad: Prioridad;
  motivo: string;
  status: 'ACTIVE' | 'INACTIVE';

  
  patient?: {
    id: number;
    nombre: string;
    apellido: string;
    documento?: string;
  };

  doctor?: {
    id: number;
    nombre: string;
  } | null;

  technologist_user?: {
    id: number;
    nombre: string;
  } | null;

  modalidad_obj?: {
    id: number;
    nombre: string;
  } | null;

  team_obj?: {
    id: number;
    nombre: string;
  } | null;

  cita_obj?: {
    id: number;
    
  } | null;

  imagenes?: Array<{
    id: number;
    url: string;
    nombreArchivo: string;
    tipo: string;
  }>;

  labels?: Array<{
    id: number;
    nombre: string;
  }>;
}


export interface GetAllStudiesResponse {
  studies: StudyReadI[];
}
export interface GetStudyByIdResponse {
  study: StudyReadI;
}
export interface DeleteStudyResponse {
  message: string;
}
