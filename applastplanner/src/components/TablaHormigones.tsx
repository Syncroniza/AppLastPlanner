import React, { useEffect, useState } from "react";
import { useHormigones } from "../components/HormigonesContext";
import { useAppContext } from "../components/Context";
import { format, toZonedTime } from 'date-fns-tz';

const TablaHormigones: React.FC = () => {
  const { hormigones, fetchHormigones } = useHormigones();
  const { clienteId, proyectoId } = useAppContext();

  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const cargarDatos = async () => {
      if (clienteId && proyectoId) {
        setLoading(true);
        const { data, currentPage, totalPages } = await fetchHormigones(clienteId, proyectoId, page);
        setTotalPages(totalPages);
        setLoading(false);
      }
    };
    cargarDatos();
  }, [clienteId, proyectoId, page, fetchHormigones]);

  const handleNextPage = () => {
    if (page < totalPages) {
      setPage((prev) => prev + 1);
    }
  };

  const handlePreviousPage = () => {
    if (page > 1) {
      setPage((prev) => prev - 1);
    }
  };

  // Función para formatear fechas en UTC
  const formatearFechaUTC = (fechaISO: string) => {
    try {
      const fecha = new Date(fechaISO);
      const zonedDate = toZonedTime(fecha, 'UTC'); // Convertir a UTC
      return format(zonedDate, 'dd/MM/yyyy', { timeZone: 'UTC' });
    } catch (error) {
      console.error("Error al formatear la fecha:", error);
      return '';
    }
  };

  return (
    <div className="p-6 bg-gray-100 rounded-md shadow-md ">
      {loading ? (
        <p>Cargando...</p>
      ) : (
        <>
          <h2 className="mb-4 text-xl font-bold text-center">Lista de Hormigones</h2>
          <div className="overflow-x-auto">
            <table className="w-full table-auto border-collapse border border-gray-300">
              <thead>
                <tr className="bg-gray-200">
                  <th className="border border-gray-300 p-2">N° GUÍA</th>
                  <th className="border border-gray-300 p-2">EMPRESA</th>
                  <th className="border border-gray-300 p-2">FECHA</th>
                  <th className="border border-gray-300 p-2">PISO</th>
                  <th className="border border-gray-300 p-2">UBICACIÓN</th>
                  <th className="border border-gray-300 p-2">ELEMENTO</th>
                  <th className="border border-gray-300 p-2">CANTIDAD</th>
                  <th className="border border-gray-300 p-2">MUESTRAS</th>
                  <th className="border border-gray-300 p-2">TIPO</th>
                </tr>
              </thead>
              <tbody>
                {hormigones.map((hormigon, index) => {
                  const fechaFormateada = formatearFechaUTC(hormigon.fecha);

                  return (
                    <tr key={index} className="text-center odd:bg-white even:bg-gray-100">
                      <td className="border border-gray-300 p-2">{hormigon.guia}</td>
                      <td className="border border-gray-300 p-2">{hormigon.empresaProveedoresHG}</td>
                      <td className="border border-gray-300 p-2">{fechaFormateada}</td>
                      <td className="border border-gray-300 p-2">{hormigon.piso}</td>
                      <td className="border border-gray-300 p-2">{hormigon.ubicacion}</td>
                      <td className="border border-gray-300 p-2">{hormigon.elemento}</td>
                      <td className="border border-gray-300 p-2">{hormigon.cantidad}</td>
                      <td className="border border-gray-300 p-2">{hormigon.muestras}</td>
                      <td className="border border-gray-300 p-2">{hormigon.tipo}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Controles de paginación */}
          <div className="flex justify-center items-center mt-4 space-x-4">
            <button
              onClick={handlePreviousPage}
              disabled={page === 1}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
            >
              &larr; Anterior
            </button>
            <span>Página {page} de {totalPages}</span>
            <button
              onClick={handleNextPage}
              disabled={page === totalPages}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
            >
              Siguiente &rarr;
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default TablaHormigones;