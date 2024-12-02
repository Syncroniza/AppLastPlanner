import React, { useEffect, useState } from 'react';
import { useAppContext } from './Context';
import { useLocation } from 'react-router-dom';
import Modal from './Modal'; // Asegúrate de que la ruta de importación sea correcta
import { RestriccionesForm } from '../types/Restricciones';
import * as XLSX from 'xlsx';
import API from '../api';

const ListadoRestricciones: React.FC = () => {
  const { restricciones, getRestriccionesByProyecto, } = useAppContext();

  const location = useLocation();
  const { clienteId, proyectoId } = location.state || {}; // Extrae clienteId y proyectoId del estado
  const [filteredRestricciones, setFilteredRestricciones] = useState<RestriccionesForm[]>([]);
  console.log("filteredRestricciones",filteredRestricciones)
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedRestriccion, setSelectedRestriccion] = useState<RestriccionesForm | null>(null);
  const [sortConfig, setSortConfig] = useState<{ key: string; direction: 'asc' | 'desc' } | null>(null);

  // Verifica y filtra las restricciones basadas en proyectoId y clienteId
  useEffect(() => {
  console.log("proyectoId recibido en el gráfico:", proyectoId);
  console.log("clienteId recibido en el gráfico:", clienteId);
  
  if (proyectoId) {
    const restriccionesFiltradas = getRestriccionesByProyecto(proyectoId, clienteId);
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
  const handleCheckboxChange = async (restriccion: RestriccionesForm) => {
    try {
      const updatedData = {
        ...restriccion,
        status: 'cerrada',
        nuevafecha: new Date().toISOString(), // Establece la fecha actual como fecha de cierre
      };

      const response = await API.patch(`/restricciones/${restriccion._id}`, updatedData);
      if (response.status === 200) {
        setFilteredRestricciones((prev) =>
          prev.map((r) => (r._id === restriccion._id ? { ...r, ...updatedData } : r))
        );
      }
    } catch (error) {
      console.error('Error al actualizar la restricción:', error);
    }
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
  console.log("Contenido de sortedRestricciones:", sortedRestricciones);
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
            <th className="px-4 py-2 border-b">Cerrar restriccion</th>
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
            <th onClick={() => handleSort('nuevafecha')} className="px-4 py-2 border-b cursor-pointer">
              Fecha de Cierre {sortConfig?.key === 'nuevafecha' ? (sortConfig.direction === 'asc' ? '↑' : '↓') : ''}
            </th>
            <th className="px-4 py-2 border-b">Status</th>
            <th className="px-4 py-2 border-b">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {sortedRestricciones.length > 0 ? (
            sortedRestricciones.map((restriccion) => (
              <tr key={restriccion._id} className="hover:bg-gray-50">
                <td className="px-4 py-2 border-b text-center">
                  <button
                    onClick={() => handleCheckboxChange(restriccion)}
                    disabled={restriccion.status === 'cerrada'} // Deshabilita si ya está cerrada
                    className={`px-4 py-2 text-white font-semibold rounded ${
                      restriccion.status === 'cerrada'
                        ? 'bg-gray-400 cursor-not-allowed'
                        : 'bg-red-500 hover:bg-red-600'
                    }`}
                  >
                    {restriccion.status === 'cerrada' ? 'Cerrada' : 'Cerrar'}
                  </button>
                </td>
                <td className="px-4 py-2 border-b">
                  {restriccion.responsable
                    ? `${restriccion.responsable.nombre} ${restriccion.responsable.apellido}`
                    : 'No asignado'}
                </td>
                <td className="px-4 py-2 border-b">{restriccion.compromiso}</td>
                <td className="px-4 py-2 border-b">{restriccion.centrocosto}</td>
                <td className="px-4 py-2 border-b">
                  {restriccion.fechacreacion
                    ? new Date(restriccion.fechacreacion).toLocaleDateString('es-ES')
                    : 'N/A'}
                </td>
                <td className="px-4 py-2 border-b">
                  {restriccion.fechacompromiso
                    ? new Date(restriccion.fechacompromiso).toLocaleDateString('es-ES')
                    : 'N/A'}
                </td>
                <td className="px-4 py-2 border-b">
                  {restriccion.nuevafecha
                    ? new Date(restriccion.nuevafecha).toLocaleDateString('es-ES')
                    : 'N/A'}
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
            ))
          ) : (
            <tr>
      <td colSpan={9} className="px-4 py-2 border-b text-center">
        No hay restricciones para este proyecto.
      </td>
    </tr>
  )}
</tbody>


      </table>

      {isModalOpen && (
        <Modal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
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
