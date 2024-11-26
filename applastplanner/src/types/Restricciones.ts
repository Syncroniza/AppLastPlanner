import { Proyecto } from "../types/Proyecto";


export interface RestriccionesForm {
  _id: string;
  id_restriccion: string;
  responsable: string;
  compromiso: string;
  centrocosto: string;
  fechacreacion: string | null;
  fechacompromiso: string | null;
  nuevafecha: string | null;
  cnc: string;
  status: string;
  observaciones: string;
  aliases: string[];
  cliente: string; // ID del cliente
  proyecto: string | Proyecto; // Puede ser un ID o un objeto poblado
  createdAt: string;
  updatedAt: string;
}