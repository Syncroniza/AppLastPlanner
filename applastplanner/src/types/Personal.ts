
export interface Personal {
    _id: string;
    nombre: string;
    apellido: string;
    empresa: string;
    telefono: string;
    correo: string;
    cargo: string;
    cliente: {
      _id: string;
      nombre: string;
    };
    proyecto: {
      _id: string; // ID del proyecto asociado
      nombre: string; // Nombre del proyecto asociado
    };
  }
  