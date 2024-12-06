export interface Responsable {
  _id: string;
  nombre: string;
  apellido: string;
}

export interface RestriccionesForm {
  [key: string]: any;
  _id?: string;
  responsable: string | Responsable;
  compromiso: string;
  centrocosto: string;
  fechacreacion: string;
  fechacompromiso: string;
  status: string;
  observaciones: string;
  cnc: string;
  nuevafecha: string;
  aliases: string[];
  cliente: string | { _id: string } | null; // String, objeto con _id, o null
  proyecto: string | { _id: string } | null; // String, objeto con _id, o null
  createdAt: string;
  updatedAt: string;
}
