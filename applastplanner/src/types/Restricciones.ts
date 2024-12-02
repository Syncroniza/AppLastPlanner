export interface Responsable {
  _id: string;
  nombre: string;
  apellido: string;
}

export interface RestriccionesForm {
  _id:string;
  responsable: Responsable;
  compromiso: string;
  centrocosto: string;
  fechacreacion: string;
  fechacompromiso: string;
  status: string;
  observaciones: string;
  cnc: string;
  nuevafecha: string;
  aliases: string[];
  cliente: string | null; // Permitir null
  proyecto: string | null; // Permitir null
  createdAt: string;
  updatedAt: string;
}
