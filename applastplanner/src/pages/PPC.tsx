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
  const { clienteId, proyectoId, getRestriccionesByProyecto } = useAppContext();
  const [restriccionesFiltradas, setRestriccionesFiltradas] = useState<RestriccionesForm[]>([]);

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
    <div className="flex flex-col items-center w-full p-4 bg-gray-200">
      <button
        onClick={handleDownloadPDF}
        className="mb-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
      >
        Descargar PDF
      </button>

      <div id="pdf-content" className="w-full max-w-4xl p-4 bg-blue-200 shadow-md rounded-lg">
        <h1 className="text-3xl font-bold text-center mb-6">Informe de Restricciones</h1>

        {/* Contenedor de los gráficos centrados */}
        <div className="flex flex-col items-center mb-6 space-y-6">
          <div className="w-full max-w-md">
            <GraficoRestricciones />
          </div>
          <div className="w-full max-w-md">
            <ResumenRestriccionesPorResponsable />
          </div>
        </div>

        <h2 className="text-2xl font-semibold mb-4 text-center">Listado de Restricciones</h2>
        {restriccionesFiltradas.length > 0 ? (
          <div className="overflow-x-auto w-full">
            <table className="min-w-full border-collapse border border-gray-300">
              <thead>
                <tr className="bg-gray-200">
                  <th className="border border-gray-300 px-4 py-2 text-left">Responsable</th>
                  <th className="border border-gray-300 px-4 py-2 text-left">Restricción</th>
                  <th className="border border-gray-300 px-4 py-2 text-left">Fecha de Creación</th>
                  <th className="border border-gray-300 px-4 py-2 text-left">Fecha Compromiso</th>
                  <th className="border border-gray-300 px-4 py-2 text-left">Status</th>
                  <th className="border border-gray-300 px-4 py-2 text-left">CNC</th>
                  <th className="border border-gray-300 px-4 py-2 text-left">Nueva Fecha</th>
                </tr>
              </thead>
              <tbody>
                {restriccionesFiltradas.map((restriccion: RestriccionesForm) => (
                  <tr key={restriccion._id}>
                    <td className="border border-gray-300 px-4 py-2">
                      {restriccion.responsable
                        ? `${restriccion.responsable.nombre} ${restriccion.responsable.apellido}`
                        : 'No asignado'}
                    </td>
                    <td className="border border-gray-300 px-4 py-2">{restriccion.compromiso}</td>
                    <td className="border border-gray-300 px-4 py-2">
                      {formatDate(restriccion.fechacreacion)}
                    </td>
                    <td className="border border-gray-300 px-4 py-2">
                      {formatDate(restriccion.fechacompromiso)}
                    </td>
                    <td className="border border-gray-300 px-4 py-2">{restriccion.status}</td>
                    <td className="border border-gray-300 px-4 py-2">{restriccion.cnc}</td>
                    <td className="border border-gray-300 px-4 py-2">
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
