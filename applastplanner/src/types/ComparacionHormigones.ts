export interface ComparacionHormigones {
  semana: string;
  Hg_Planificado: number;
  Hg_Real: number;
  inicioSemana: string;
  Hg_Planificado_Acumulado?: number; // Nuevo campo opcional
  Hg_Real_Acumulado?: number;        // Nuevo campo opcional
}