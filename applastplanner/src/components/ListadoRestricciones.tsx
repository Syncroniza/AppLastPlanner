import React, { useEffect, useState } from 'react';
import { useAppContext } from './Context';
import { useLocation } from 'react-router-dom';
import Modal from './Modal'; // Asegúrate de que la ruta de importación sea correcta
import { RestriccionesForm } from '../types/Restricciones';
import * as XLSX from 'xlsx';

const ListadoRestricciones: React.FC = () => {
  const { restricciones, getRestriccionesByProyecto, } = useAppContext();

  const location = useLocation();
  const { clienteId, proyectoId } = location.state || {}; // Extrae clienteId y proyectoId del estado
  const [filteredRestricciones, setFilteredRestricciones] = useState<RestriccionesForm[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedRestriccion, setSelectedRestriccion] = useState<RestriccionesForm | null>(null);
  const [sortConfig, setSortConfig] = useState<{ key: string; direction: 'asc' | 'desc' } | null>(null);

  // Verifica y filtra las restricciones basadas en proyectoId y clienteId
  useEffect(() => {
  console.log("proyectoId recibido en el gráfico:", proyectoId);
  console.log("clienteId recibido en el gráfico:", clienteId);
  
  if (proyectoId) {
    const restriccionesFiltradas = getRestriccionesByProyecto(proyectoId, clienteId);
    console.log("Restricciones filtradas:", restriccionesFiltradas);
    setFilteredRestricciones(restriccionesFiltradas);
  } else {
    console.warn("No se recibió proyectoId para filtrar restricciones");
  }
}, [proyectoId, clienteId, getRestriccionesByProyecto]);


  // Ordena las restricciones
  const sortedRestricciones = React.useMemo(() => {
    if (!sortConfig) return filteredRestricciones;
    return [...filteredRestricciones].sort((a, b) => {
      if (sortConfig.key === 'fechacreacion' || sortConfig.key === 'fechacompromiso' || sortConfig.key === 'nuevafecha') {
        const dateA = new Date(a[sortConfig.key as keyof RestriccionesForm] as string);
        const dateB = new Date(b[sortConfig.key as keyof RestriccionesForm] as string);
        return sortConfig.direction === 'asc' ? dateA.getTime() - dateB.getTime() : dateB.getTime() - dateA.getTime();
      } else {
        const valueA = (a[sortConfig.key as keyof RestriccionesForm] as string).toLowerCase();
        const valueB = (b[sortConfig.key as keyof RestriccionesForm] as string).toLowerCase();
        return sortConfig.direction === 'asc' ? valueA.localeCompare(valueB) : valueB.localeCompare(valueA);
      }
    });
  }, [filteredRestricciones, sortConfig]);

  const handleSort = (key: string) => {
    let direction: 'asc' | 'desc' = 'asc';
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const handleEditClick = (restriccion: RestriccionesForm) => {
    setSelectedRestriccion(restriccion);
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
  };

  const handleExportToExcel = () => {
    const dataToExport = filteredRestricciones.map((restriccion) => ({
      responsable: restriccion.responsable,
      compromiso: restriccion.compromiso,
      centrocosto: restriccion.centrocosto,
      fechacreacion: restriccion.fechacreacion
        ? new Date(new Date(restriccion.fechacreacion).getTime() - new Date().getTimezoneOffset() * 60000)
            .toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit', year: '2-digit' })
        : '',
      fechacompromiso: restriccion.fechacompromiso
        ? new Date(new Date(restriccion.fechacompromiso).getTime() - new Date().getTimezoneOffset() * 60000)
            .toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit', year: '2-digit' })
        : '',
      status: restriccion.status,
    }));

    const worksheet = XLSX.utils.json_to_sheet(dataToExport);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Restricciones');
    XLSX.writeFile(workbook, 'restricciones.xlsx');
  };

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
            <th className="px-4 py-2 border-b">Status</th>
            <th className="px-4 py-2 border-b">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {sortedRestricciones.length > 0 ? (
            sortedRestricciones.map((restriccion) => (
              <tr key={restriccion._id} className="hover:bg-gray-50">
                <td className="px-4 py-2 border-b">{restriccion.responsable}</td>
                <td className="px-4 py-2 border-b">{restriccion.compromiso}</td>
                <td className="px-4 py-2 border-b">{restriccion.centrocosto}</td>
                <td className="px-4 py-2 border-b">{new Date(restriccion.fechacreacion).toLocaleDateString('es-ES')}</td>
                <td className="px-4 py-2 border-b">{new Date(restriccion.fechacompromiso).toLocaleDateString('es-ES')}</td>
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
            ))
          ) : (
            <tr>
              <td colSpan={7} className="px-4 py-2 border-b text-center">
                No hay restricciones para este proyecto.
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {isModalOpen && (
        <Modal
          isOpen={isModalOpen}
          onClose={handleModalClose}
          restriccion={selectedRestriccion}
          onUpdate={(updatedRestriccion) => {
            const updated = restricciones.map((r) =>
              r._id === updatedRestriccion._id ? updatedRestriccion : r
            );
            setFilteredRestricciones(updated);
            setIsModalOpen(false);
          }}
        />
      )}
    </div>
  );
};

export default ListadoRestricciones;
