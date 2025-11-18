// src/app/models/studies.ts

export type Prioridad = 'BAJA' | 'MEDIA' | 'ALTA' | 'URGENTE';

/** Payload para CREATE/UPDATE (coincide con req.body del controller) */
export interface StudyCreateI {
  // FKs requeridas
  patient_id: number;
  modality_id: number;
  team_id: number;

  // FKs opcionales
  technologist_id?: number | null;
  medico_id?: number | null;
  quote_id?: number | null;

  // Datos propios
  fechaHora: string;            // ISO string
  prioridad: Prioridad;         // 'BAJA' | 'MEDIA' | 'ALTA' | 'URGENTE'
  motivo: string;
  status?: 'ACTIVE' | 'INACTIVE';

  // N:N opcional (IDs de labels). El controller lo acepta en POST/PUT.
  labels?: number[];
}

/** Estructura que devuelve el backend (Study + relaciones del STUDY_INCLUDE) */
export interface StudyReadI {
  id: number;

  // FKs tal cual las guarda el backend
  patient_id: number;
  modality_id: number;
  team_id: number;
  technologist_id: number | null;
  medico_id: number | null;
  quote_id: number | null;

  // Datos propios
  fechaHora: string;            // el controller te lo devolverá serializado
  prioridad: Prioridad;
  motivo: string;
  status: 'ACTIVE' | 'INACTIVE';

  // Relaciones incluidas (alias EXACTOS del controller)
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
    // el controller ahora expone solo "id" en attributes; ajusta si luego añades más
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

/** Wrappers EXACTOS que retorna el controller */
export interface GetAllStudiesResponse {
  studies: StudyReadI[];
}
export interface GetStudyByIdResponse {
  study: StudyReadI;
}
export interface DeleteStudyResponse {
  message: string;
}
