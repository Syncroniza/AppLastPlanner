import React, { useEffect } from 'react';
import axios from 'axios';
import { useAppContext } from './Context';
import { useLocation } from 'react-router-dom';

const ListadoRestricciones: React.FC = () => {
  const { restricciones, setRestricciones } = useAppContext();
  const location = useLocation();
  const { clienteId, proyectoId } = location.state || {}; // Extrae clienteId y proyectoId del estado de la navegación

  // Cargar las restricciones filtradas por cliente y proyecto
  useEffect(() => {
    const fetchRestricciones = async () => {
      try {
        const response = await axios.get(`http://localhost:8000/restricciones`, {
          params: {
            clienteId,
            proyectoId,
          },
        });
        setRestricciones(response.data.data);
      } catch (error) {
        console.error('Error al obtener las restricciones:', error);
      }
    };

    if (clienteId && proyectoId) {
      fetchRestricciones();
    } else {
      console.warn('clienteId o proyectoId no está presente');
    }
  }, [clienteId, proyectoId, setRestricciones]);

  if (!restricciones || restricciones.length === 0) {
    return <p>No hay restricciones para este cliente y proyecto.</p>;
  }

  return (
    <div className="overflow-x-auto mt-4">
      <h1 className="text-3xl font-bold mb-4">LISTADO DE RESTRICCIONES</h1>
      <table className="min-w-full bg-white border border-gray-200">
        <thead>
          <tr className="bg-gray-100">
            <th className="px-4 py-2 border-b">Responsable</th>
            <th className="px-4 py-2 border-b">Compromiso</th>
            <th className="px-4 py-2 border-b">Centro de Costo</th>
            <th className="px-4 py-2 border-b">Fecha de Creación</th>
            <th className="px-4 py-2 border-b">Fecha de Compromiso</th>
            <th className="px-4 py-2 border-b">CNC</th>
            <th className="px-4 py-2 border-b">Nueva Fecha</th>
            <th className="px-4 py-2 border-b">Status</th>
          </tr>
        </thead>
        <tbody>
          {restricciones.map((restriccion) => (
            <tr key={restriccion._id} className="hover:bg-gray-50">
              <td className="px-4 py-2 border-b">{restriccion.responsable}</td>
              <td className="px-4 py-2 border-b">{restriccion.compromiso}</td>
              <td className="px-4 py-2 border-b">{restriccion.centrocosto}</td>
              <td className="px-4 py-2 border-b">{new Date(restriccion.fechacreacion).toLocaleDateString()}</td>
              <td className="px-4 py-2 border-b">{new Date(restriccion.fechacompromiso).toLocaleDateString()}</td>
              <td className="px-4 py-2 border-b">{restriccion.cnc}</td>
              <td className="px-4 py-2 border-b">
                {restriccion.nuevafecha ? new Date(restriccion.nuevafecha).toLocaleDateString() : ''}
              </td>
              <td className="px-4 py-2 border-b">{restriccion.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ListadoRestricciones;
