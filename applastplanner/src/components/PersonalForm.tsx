import axios from 'axios';
import React, { useState } from 'react';
import {BASE_URL} from "../constants.ts";

interface TeamMember {
  id: string;
  nombre: string;
  apellido: string;
  empresa: string;
  telefono: string;
  correo: string;
  cargo: string;
}

const FormularioEquipo: React.FC = () => {
  const [formData, setFormData] = useState<TeamMember>({
    id: '',
    nombre: '',
    apellido: '',
    empresa: '',
    telefono: '',
    correo: '',
    cargo: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
        const response = await axios.post(BASE_URL + '/equipo/', formData);
      
      if (response.status === 200 || response.status === 201) {
        console.log('Datos enviados correctamente');
        // Limpia el formulario o muestra un mensaje de éxito
        setFormData({
          id: '',
          nombre: '',
          apellido: '',
          empresa: '',
          telefono: '',
          correo: '',
          cargo: '',
        });
      } else {
        console.error('Error al enviar los datos');
      }
    } catch (error) {
      console.error('Error de red o en la solicitud:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-wrap items-center gap-4">
      <div className="flex flex-col">
        <label className="mb-1 font-medium">ID:</label>
        <input type="text" name="id" value={formData.id} onChange={handleChange} required className="border p-1 rounded" />
      </div>
      <div className="flex flex-col">
        <label className="mb-1 font-medium">Nombre:</label>
        <input type="text" name="nombre" value={formData.nombre} onChange={handleChange} required className="border p-1 rounded" />
      </div>
      <div className="flex flex-col">
        <label className="mb-1 font-medium">Apellido:</label>
        <input type="text" name="apellido" value={formData.apellido} onChange={handleChange} required className="border p-1 rounded" />
      </div>
      <div className="flex flex-col">
        <label className="mb-1 font-medium">Teléfono:</label>
        <input type="tel" name="telefono" value={formData.telefono} onChange={handleChange} required className="border p-1 rounded" />
      </div>
      <div className="flex flex-col">
        <label className="mb-1 font-medium">Correo:</label>
        <input type="email" name="correo" value={formData.correo} onChange={handleChange} required className="border p-1 rounded" />
      </div>
      <div className="flex flex-col">
        <label className="mb-1 font-medium">Cargo:</label>
        <input type="text" name="cargo" value={formData.cargo} onChange={handleChange} required className="border p-1 rounded" />
      </div>
      <div className="flex flex-col">
        <label className="mb-1 font-medium">Empresa:</label>
        <input type="text" name="empresa" value={formData.empresa} onChange={handleChange} required className="border p-1 rounded" />
      </div>
      <button type="submit" className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600">
        Enviar
      </button>
    </form>
  );
};

export default FormularioEquipo;
