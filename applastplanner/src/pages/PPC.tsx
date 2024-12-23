import React, { useEffect, useState } from 'react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import GraficoRestricciones from '../components/GraficoRestricciones';
import ResumenRestriccionesPorResponsable from '../components/ResumenRestriccionesPorResponsable';
import { useAppContext } from '../components/Context';
import { RestriccionesForm } from '../types/Restricciones';

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('es-ES', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  }).format(date);
};

const PageWithPDF: React.FC = () => {
  const { clienteId, proyectoId, getRestriccionesByProyecto, proyectos } = useAppContext();
  console.log("clienteId", clienteId)
  const [restriccionesFiltradas, setRestriccionesFiltradas] = useState<RestriccionesForm[]>([]);
  const fechaGeneracion = formatDate(new Date().toISOString());


  // Obtener el nombre del proyecto basado en `proyectoId`
  const nombreProyecto = React.useMemo(() => {
    const proyecto = proyectos.find((p) => p._id === proyectoId);
    return proyecto ? proyecto.nombre : 'Proyecto desconocido';
  }, [proyectoId, proyectos]);
  useEffect(() => {
    if (proyectoId) {
      const todasLasRestricciones = getRestriccionesByProyecto(proyectoId, clienteId || undefined);
      const restriccionesAbiertas = todasLasRestricciones.filter(
        (restriccion: RestriccionesForm) => restriccion.status === 'abierta'
      );
      setRestriccionesFiltradas(restriccionesAbiertas);

    }
  }, [proyectoId, clienteId, getRestriccionesByProyecto]);

  const handleDownloadPDF = async () => {
    const input = document.getElementById('pdf-content');
    if (input) {
      const canvas = await html2canvas(input, { scale: 2 });
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'pt',
        format: 'a4',
      });

      const margin = 20;
      const pageWidth = pdf.internal.pageSize.getWidth();
      const imgWidth = pageWidth - margin * 2;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;

      pdf.addImage(imgData, 'PNG', margin, margin, imgWidth, imgHeight);
      pdf.save('reporte-restricciones.pdf');
    }
  };

  return (
    <div className="flex flex-col items-center w-full overflow-x-auto p-4 bg-gray-200">
      <button
        onClick={handleDownloadPDF}
        className="mb-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-500"
      >
        Descargar PDF
      </button>
      <div id="pdf-content" className="w-full  p-4 bg-white shadow-md rounded-lg">
        <h1 className="text-3xl font-bold text-center mb-6">Informe de Restricciones</h1>
        <p className="text-center text-sm mb-6">
          Proyecto: <strong>{nombreProyecto}</strong>
        </p>
        <p className="text-center text-sm mb-4">
          Fecha de generación: <strong>{fechaGeneracion}</strong>
        </p>

        {/* Contenedor de los gráficos centrados */}
        <div className="flex flex-col items-center mb-6 space-y-6">
          <div className="w-full h-auto">
            <GraficoRestricciones />
          </div>
          <div>
      <div></div>
          </div>
          <div className="w-full h-96">
            <ResumenRestriccionesPorResponsable />
          </div>
        </div>

            <h2 className="text-2xl font-semibold  mb-4 mt-48 text-center">Listado de Restricciones</h2>
            {restriccionesFiltradas.length > 0 ? (
              <div className="w-full h-auto">
                <table className="min-w-full border-collapse border border-gray-300 divide-y divide-gray-300">
                  <thead className="bg-gray-200">
                    <tr>
                      <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Responsable</th>
                      <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Restricción</th>
                      <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Fecha de Creación</th>
                      <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Fecha Compromiso</th>
                      <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Status</th>
                      <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">CNC</th>
                      <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Nueva Fecha</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-300">
                    {restriccionesFiltradas.map((restriccion: RestriccionesForm) => (
                      <tr
                        key={restriccion._id}
                        className="odd:bg-gray-100 even:bg-white hover:bg-gray-200"
                      >
                        <td className="px-6 py-3">
                          {typeof restriccion.responsable === 'object' && restriccion.responsable !== null
                            ? `${restriccion.responsable.nombre} ${restriccion.responsable.apellido}`
                            : 'No asignado'}
                        </td>
                        <td className="px-6 py-3">{restriccion.compromiso}</td>
                        <td className="px-6 py-3">
                          {formatDate(restriccion.fechacreacion)}
                        </td>
                        <td className="px-6 py-3">
                          {formatDate(restriccion.fechacompromiso)}
                        </td>
                        <td className="px-6 py-3">{restriccion.status}</td>
                        <td className="px-6 py-3">{restriccion.cnc}</td>
                        <td className="px-6 py-3">
                          {restriccion.nuevafecha ? formatDate(restriccion.nuevafecha) : 'N/A'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="text-center">No hay restricciones disponibles.</p>
            )}
          </div>
    </div>
  );
};

export default PageWithPDF;
