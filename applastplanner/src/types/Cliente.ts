import { Proyecto } from './Proyecto';

export interface Cliente {
  _id: string;
  nombre: string;
  email: string;
  telefono: string;
  direccion: string;
  proyectos: Proyecto[]; // Asegúrate de que esta propiedad esté presente
}
