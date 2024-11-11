import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useAppContext } from './Context';
import { useLocation } from 'react-router-dom';
import Modal from './Modal'; // Asegúrate de que la ruta de importación sea correcta
import { RestriccionesForm } from '../types/Restricciones';

const ListadoRestricciones: React.FC = () => {
  const { restricciones, setRestricciones } = useAppContext();
  const location = useLocation();
  const { clienteId, proyectoId } = location.state || {}; // Extrae clienteId y proyectoId del estado de la navegación

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedRestriccion, setSelectedRestriccion] = useState<RestriccionesForm | null>(null);

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

  const handleEditClick = (restriccion: RestriccionesForm) => {
    setSelectedRestriccion(restriccion);
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setSelectedRestriccion(null);
  };

  const handleUpdate = (updatedRestriccion: RestriccionesForm) => {
    setRestricciones((prevRestricciones) =>
      prevRestricciones.map((restriccion) =>
        restriccion._id === updatedRestriccion._id ? updatedRestriccion : restriccion
      )
    );
  };

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
            <th className="px-4 py-2 border-b">Acciones</th>
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
              <td className="px-4 py-2 border-b">
                <button
                  onClick={() => handleEditClick(restriccion)}
                  className="bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600"
                >
                  Editar
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Modal de edición */}
      {isModalOpen && (
        <Modal
          isOpen={isModalOpen}
          onClose={handleModalClose}
          restriccion={selectedRestriccion}
          onUpdate={handleUpdate}
        />
      )}
    </div>
  );
};

export default ListadoRestricciones;
