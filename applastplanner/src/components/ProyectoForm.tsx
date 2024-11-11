import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Cliente } from '../types/Cliente';

interface ProyectoFormProps {
  onProyectoCreated?: () => void; // Callback opcional para actualizar la lista de proyectos
}

const ProyectoForm: React.FC<ProyectoFormProps> = ({ onProyectoCreated }) => {
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [formData, setFormData] = useState({
    nombre: '',
    descripcion: '',
    fechaInicio: '',
    fechaFin: '',
    clienteId: '',
  });

  useEffect(() => {
    // Cargar la lista de clientes al montar el componente
    const fetchClientes = async () => {
      try {
        const response = await axios.get('http://localhost:8000/clientes/');
        setClientes(response.data.data);
      } catch (error) {
        console.error('Error al obtener los clientes:', error);
      }
    };

    fetchClientes();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:8000/proyectos/', formData);
      if (response.status === 201 || response.status === 200) {
        console.log('Proyecto creado correctamente:', response.data);
        setFormData({ nombre: '', descripcion: '', fechaInicio: '', fechaFin: '', clienteId: '' });
        if (onProyectoCreated) {
          onProyectoCreated(); // Llama al callback si existe
        }
      }
    } catch (error) {
      console.error('Error al crear el proyecto:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-4 bg-white shadow-md rounded-md max-w-md mx-auto">
      <h2 className="text-2xl font-bold mb-4">Crear Proyecto</h2>
      <div className="mb-3">
        <label className="block text-sm font-semibold mb-1">Cliente</label>
        <select
          name="clienteId"
          value={formData.clienteId}
          onChange={handleChange}
          className="w-full border border-gray-300 rounded-md p-2 text-sm"
          required
        >
          <option value="">Seleccione un cliente</option>
          {clientes.map((cliente) => (
            <option key={cliente._id} value={cliente._id}>
              {cliente.nombre}
            </option>
          ))}
        </select>
      </div>
      {['nombre', 'descripcion', 'fechaInicio', 'fechaFin'].map((field) => (
        <div key={field} className="mb-3">
          <label className="block text-sm font-semibold mb-1 capitalize">{field}</label>
          <input
            type={field.includes('fecha') ? 'date' : 'text'}
            name={field}
            value={formData[field as keyof typeof formData]}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-md p-2 text-sm"
            required={field === 'nombre'} // Requerido solo para el nombre
          />
        </div>
      ))}
      <button
        type="submit"
        className="w-full bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600"
      >
        Crear Proyecto
      </button>
    </form>
  );
};

export default ProyectoForm;
