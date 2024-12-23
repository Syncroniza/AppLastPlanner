export interface CurvaHormigonData {
    _id?: string;
    inicio: string; // Fecha en formato ISO
    fin: string;    // Fecha en formato ISO
    Hg_Planificado: number;
    cliente: string;  // ID del cliente
    proyecto: string; // ID del proyecto
    createdAt?: string;
    updatedAt?: string;
  }
  