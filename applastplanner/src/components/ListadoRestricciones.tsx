import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAppContext } from './Context';
import Modal from './Modal';
import { RestriccionesForm } from '../types/Restricciones';

const ListadoRestricciones: React.FC = () => {
  const { restricciones, setRestricciones } = useAppContext();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedRestriccion, setSelectedRestriccion] = useState<RestriccionesForm | null>(null);

  // Función para abrir el modal con la restricción seleccionada
  const openModal = (restriccion: RestriccionesForm) => {
    setSelectedRestriccion(restriccion);
    setIsModalOpen(true);
  };

  // Función para cerrar el modal
  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedRestriccion(null);
  };

  // Manejar la actualización después de que se realice la edición en el modal
  const handleUpdate = (updatedRestriccion: RestriccionesForm) => {
    setRestricciones((prevRestricciones) =>
      prevRestricciones.map((restriccion) =>
        restriccion._id === updatedRestriccion._id ? updatedRestriccion : restriccion
      )
    );
  };

  // Cargar las restricciones cuando el componente se monta
  useEffect(() => {
    const fetchRestricciones = async () => {
      try {
        const response = await axios.get('http://localhost:8000/restricciones/');
        setRestricciones(response.data.data);
      } catch (error) {
        console.error('Error al obtener las restricciones:', error);
      }
    };

    fetchRestricciones();
  }, [setRestricciones]);

  return (
    <div className="overflow-x-auto mt-4">
      <h1 className="text-3xl font-bold mb-4">LISTADO DE RESTRICCIONES</h1>
      <div className="min-w-full overflow-hidden rounded-lg shadow-lg">
        <table className="w-full bg-white border-collapse border border-gray-200">
          <thead>
            <tr className="bg-gray-100">
              <th className="px-4 py-2 border-b text-sm font-semibold">Responsable</th>
              <th className="px-4 py-2 border-b text-sm font-semibold">Compromiso</th>
              <th className="px-4 py-2 border-b text-sm font-semibold hidden md:table-cell">Centro de Costo</th>
              <th className="px-4 py-2 border-b text-sm font-semibold hidden lg:table-cell">Fecha de Creación</th>
              <th className="px-4 py-2 border-b text-sm font-semibold hidden lg:table-cell">Fecha de Compromiso</th>
              <th className="px-4 py-2 border-b text-sm font-semibold hidden xl:table-cell">CNC</th>
              <th className="px-4 py-2 border-b text-sm font-semibold hidden xl:table-cell">Nueva Fecha</th>
              <th className="px-4 py-2 border-b text-sm font-semibold">Status</th>
              <th className="px-4 py-2 border-b text-sm font-semibold">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {restricciones.map((restriccion) => (
              <tr key={restriccion._id} className="hover:bg-gray-50">
                <td className="px-4 py-2 border-b text-sm">{restriccion.responsable}</td>
                <td className="px-4 py-2 border-b text-sm">{restriccion.compromiso}</td>
                <td className="px-4 py-2 border-b text-sm hidden md:table-cell">{restriccion.centrocosto}</td>
                <td className="px-4 py-2 border-b text-sm hidden lg:table-cell">
                  {new Date(restriccion.fechacreacion).toLocaleDateString()}
                </td>
                <td className="px-4 py-2 border-b text-sm hidden lg:table-cell">
                  {new Date(restriccion.fechacompromiso).toLocaleDateString()}
                </td>
                <td className="px-4 py-2 border-b text-sm hidden xl:table-cell">{restriccion.cnc}</td>
                <td className="px-4 py-2 border-b text-sm hidden xl:table-cell">
                  {new Date(restriccion.nuevafecha).toLocaleDateString()}
                </td>
                <td className="px-4 py-2 border-b text-sm">{restriccion.status}</td>
                <td className="px-4 py-2 border-b text-sm">
                  <button
                    onClick={() => openModal(restriccion)}
                    className="px-2 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
                  >
                    Editar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Renderizar el modal si está abierto */}
      {isModalOpen && selectedRestriccion && (
        <Modal
          isOpen={isModalOpen}
          onClose={closeModal}
          restriccion={selectedRestriccion}
          onUpdate={handleUpdate}
        />
      )}
    </div>
  );
};

export default ListadoRestricciones;
