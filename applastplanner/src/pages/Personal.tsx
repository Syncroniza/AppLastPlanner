import React, { useEffect, useState } from 'react';
import axios from 'axios';
import PersonalForm from"../components/PersonalForm"

import {useAppContext} from "../components/Context"

const PersonalTable: React.FC = () => {

  const { equipoData, setEquipoData } = useAppContext();

  
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('http://localhost:8000/equipo/');
        console.log(response)
        setEquipoData(response.data.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching data:', error);
        setError('Failed to fetch data');
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div>
      <h1 className="text-3xl font-bold mb-4">LISTADO DE PERSONAL </h1>
    <PersonalForm />
 
    <table className="min-w-full border border-gray-200 divide-y divide-gray-200 mt-4">
      <thead className="bg-gray-100">
        <tr>
          <th className="px-4 py-2 border-b border-gray-300">ID</th>
          <th className="px-4 py-2 border-b border-gray-300">Nombre</th>
          <th className="px-4 py-2 border-b border-gray-300">Apellido</th>
          <th className="px-4 py-2 border-b border-gray-300">Empresa</th>
          <th className="px-4 py-2 border-b border-gray-300">Teléfono</th>
          <th className="px-4 py-2 border-b border-gray-300">Correo</th>
          <th className="px-4 py-2 border-b border-gray-300">Cargo</th>
        </tr>
      </thead>
      <tbody className="divide-y divide-gray-200">
  {equipoData.map((personal, index) => (
    <tr key={personal.id || index} className="hover:bg-gray-50">
      <td className="px-4 py-2 border-r border-gray-300">{index + 1}</td> {/* ID correlativo */}
      <td className="px-4 py-2 border-r border-gray-300">{personal.nombre}</td>
      <td className="px-4 py-2 border-r border-gray-300">{personal.apellido}</td>
      <td className="px-4 py-2 border-r border-gray-300">{personal.empresa}</td>
      <td className="px-4 py-2 border-r border-gray-300">{personal.telefono}</td>
      <td className="px-4 py-2 border-r border-gray-300">{personal.correo}</td>
      <td className="px-4 py-2">{personal.cargo}</td>
    </tr>
  ))}
</tbody>
    </table>
    </div>
  );
};

export default PersonalTable;
