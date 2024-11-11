import { Cliente } from './Cliente'; // Importa el tipo Cliente si se necesita en el proyecto

export interface Proyecto {
  _id: string; // ID generado por MongoDB
  nombre: string; // Nombre del proyecto
  descripcion?: string; // Descripción del proyecto (opcional)
  fechaInicio?: string; // Fecha de inicio (opcional)
  fechaFin?: string; // Fecha de finalización (opcional)
  cliente: Cliente | string; // Referencia al cliente (puede ser un objeto Cliente o solo un ID)
  createdAt?: string; // Fecha de creación (opcional, generado por Mongoose)
  updatedAt?: string; // Fecha de actualización (opcional, generado por Mongoose)
}
