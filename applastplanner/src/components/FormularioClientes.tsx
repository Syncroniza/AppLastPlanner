import React, { useState } from 'react';
import axios from 'axios';
import { useAppContext } from '../components/Context';
import API from '../api';

const FormularioCliente: React.FC = () => {
  const { setClientes } = useAppContext();
  const [nombre, setNombre] = useState('');
  const [email, setEmail] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await API.post('/clientes/', { nombre, email });
      setClientes((prev) => [...prev, response.data]);
      setNombre('');
      setEmail('');
    } catch (error) {
      console.error('Error al crear cliente:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mb-4">
      <h2 className="text-lg font-semibold">Crear Cliente</h2>
      <input
        type="text"
        placeholder="Nombre del cliente"
        value={nombre}
        onChange={(e) => setNombre(e.target.value)}
        className="border p-2 mb-2 w-full"
      />
      <input
        type="email"
        placeholder="Email del cliente"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="border p-2 mb-2 w-full"
      />
      <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">Crear Cliente</button>
    </form>
  );
};

export default FormularioCliente;
