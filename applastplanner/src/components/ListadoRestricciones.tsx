import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useAppContext } from './Context';
import { useLocation } from 'react-router-dom';
import Modal from './Modal'; // Asegúrate de que la ruta de importación sea correcta
import { RestriccionesForm } from '../types/Restricciones';
import * as XLSX from 'xlsx';

const ListadoRestricciones: React.FC = () => {
  const { restricciones, setRestricciones } = useAppContext();
  const location = useLocation();
  const { clienteId, proyectoId } = location.state || {}; // Extrae clienteId y proyectoId del estado de la navegación

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedRestriccion, setSelectedRestriccion] = useState<RestriccionesForm | null>(null);
  const [sortConfig, setSortConfig] = useState<{ key: string; direction: 'asc' | 'desc' } | null>(null);
  const [refreshKey, setRefreshKey] = useState(0); // Estado para forzar la re-renderización

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

        if (response.data && response.data.data.length > 0) {
          setRestricciones(response.data.data);
        } else {
          setRestricciones([]); // Limpia la lista si no hay datos
        }
      } catch (error) {
        console.error('Error al obtener las restricciones:', error);
        setRestricciones([]); // Limpia la lista en caso de error
      }
    };

    if (clienteId && proyectoId) {
      fetchRestricciones();
    } else {
      console.warn('clienteId o proyectoId no está presente');
      setRestricciones([]);
    }
  }, [clienteId, proyectoId, setRestricciones, refreshKey]); // Agrega refreshKey como dependencia

  // Función para manejar el clic de ordenar
  const handleSort = (key: string) => {
    let direction: 'asc' | 'desc' = 'asc';
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  // Ordena las restricciones basadas en sortConfig
  const sortedRestricciones = React.useMemo(() => {
    if (!sortConfig) return restricciones;

    return [...restricciones].sort((a, b) => {
      if (sortConfig.key === 'fechacreacion' || sortConfig.key === 'fechacompromiso' || sortConfig.key === 'nuevafecha') {
        const dateA = new Date(a[sortConfig.key as keyof RestriccionesForm] as string);
        const dateB = new Date(b[sortConfig.key as keyof RestriccionesForm] as string);
        return sortConfig.direction === 'asc' ? dateA.getTime() - dateB.getTime() : dateB.getTime() - dateA.getTime();
      } else {
        const valueA = (a[sortConfig.key as keyof RestriccionesForm] as string).toLowerCase();
        const valueB = (b[sortConfig.key as keyof RestriccionesForm] as string).toLowerCase();
        if (valueA < valueB) return sortConfig.direction === 'asc' ? -1 : 1;
        if (valueA > valueB) return sortConfig.direction === 'asc' ? 1 : -1;
        return 0;
      }
    });
  }, [restricciones, sortConfig]);

  const handleEditClick = (restriccion: RestriccionesForm) => {
    setSelectedRestriccion(restriccion);
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    if (selectedRestriccion) {
      const adjustedRestriccion: RestriccionesForm = {
        ...selectedRestriccion,
        fechacreacion: selectedRestriccion.fechacreacion
          ? new Date(
              new Date(selectedRestriccion.fechacreacion).getTime() -
              new Date(selectedRestriccion.fechacreacion).getTimezoneOffset() * 60000
            ).toISOString().split('T')[0]
          : '',
        fechacompromiso: selectedRestriccion.fechacompromiso
          ? new Date(
              new Date(selectedRestriccion.fechacompromiso).getTime() -
              new Date(selectedRestriccion.fechacompromiso).getTimezoneOffset() * 60000
            ).toISOString().split('T')[0]
          : '',
        nuevafecha: selectedRestriccion.nuevafecha
          ? new Date(
              new Date(selectedRestriccion.nuevafecha).getTime() -
              new Date(selectedRestriccion.nuevafecha).getTimezoneOffset() * 60000
            ).toISOString().split('T')[0]
          : '',
      };

      setSelectedRestriccion(adjustedRestriccion);
    }

    setIsModalOpen(false);
    setRefreshKey((prevKey) => prevKey + 1); // Incrementa para forzar la re-renderización
  };

  const handleUpdate = (updatedRestriccion: RestriccionesForm) => {
    setRestricciones((prevRestricciones) =>
      prevRestricciones.map((restriccion) =>
        restriccion._id === updatedRestriccion._id ? updatedRestriccion : restriccion
      )
    );
  };

  const handleExportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(restricciones);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Restricciones');
    XLSX.writeFile(workbook, 'restricciones.xlsx');
  };

  if (!restricciones || restricciones.length === 0) {
    return <p>No hay restricciones para este cliente y proyecto.</p>;
  }

  return (
    <div className="overflow-x-auto mt-4">
      <h1 className="text-3xl font-bold mb-4">LISTADO DE RESTRICCIONES</h1>
      <button
        onClick={handleExportToExcel}
        className="mb-4 bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
      >
        Exportar a Excel
      </button>
      <table className="min-w-full bg-white border border-gray-200">
        <thead>
          <tr className="bg-gray-100">
            <th onClick={() => handleSort('responsable')} className="px-4 py-2 border-b cursor-pointer">
              Responsable {sortConfig?.key === 'responsable' ? (sortConfig.direction === 'asc' ? '↑' : '↓') : ''}
            </th>
            <th onClick={() => handleSort('compromiso')} className="px-4 py-2 border-b cursor-pointer">
              Compromiso {sortConfig?.key === 'compromiso' ? (sortConfig.direction === 'asc' ? '↑' : '↓') : ''}
            </th>
            <th className="px-4 py-2 border-b">Centro de Costo</th>
            <th onClick={() => handleSort('fechacreacion')} className="px-4 py-2 border-b cursor-pointer">
              Fecha de Creación {sortConfig?.key === 'fechacreacion' ? (sortConfig.direction === 'asc' ? '↑' : '↓') : ''}
            </th>
            <th onClick={() => handleSort('fechacompromiso')} className="px-4 py-2 border-b cursor-pointer">
              Fecha de Compromiso {sortConfig?.key === 'fechacompromiso' ? (sortConfig.direction === 'asc' ? '↑' : '↓') : ''}
            </th>
            <th className="px-4 py-2 border-b">CNC</th>
            <th onClick={() => handleSort('nuevafecha')} className="px-4 py-2 border-b cursor-pointer">
              Nueva Fecha {sortConfig?.key === 'nuevafecha' ? (sortConfig.direction === 'asc' ? '↑' : '↓') : ''}
            </th>
            <th onClick={() => handleSort('status')} className="px-4 py-2 border-b cursor-pointer">
              Status {sortConfig?.key === 'status' ? (sortConfig.direction === 'asc' ? '↑' : '↓') : ''}
            </th>
            <th className="px-4 py-2 border-b">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {sortedRestricciones.map((restriccion) => (
            <tr key={restriccion._id} className="hover:bg-gray-50">
              <td className="px-4 py-2 border-b">{restriccion.responsable}</td>
              <td className="px-4 py-2 border-b">{restriccion.compromiso}</td>
              <td className="px-4 py-2 border-b">{restriccion.centrocosto}</td>
              <td className="px-4 py-2 border-b">{new Date(restriccion.fechacreacion).toLocaleDateString('es-ES')}</td>
              <td className="px-4 py-2 border-b">{new Date(restriccion.fechacompromiso).toLocaleDateString('es-ES')}</td>
              <td className="px-4 py-2 border-b">{restriccion.cnc}</td>
              <td className="px-4 py-2 border-b">
                {restriccion.nuevafecha ? new Date(restriccion.nuevafecha).toLocaleDateString('es-ES') : ''}
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
