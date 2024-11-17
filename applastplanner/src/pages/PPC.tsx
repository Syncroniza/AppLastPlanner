import React from 'react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import GraficoRestricciones from '../components/GraficoRestricciones';
import ResumenRestriccionesPorResponsable from '../components/ResumenRestriccionesPorResponsable';
import { useAppContext } from '../components/Context'; // Importa el hook
import { RestriccionesForm } from '../types/Restricciones'; // Importa el tipo
// Función para formatear fechas a "DD/MM/YYYY"
const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('es-ES', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  }).format(date);
};

const PageWithPDF: React.FC = () => {
  // Usa el hook para acceder al contexto
  const { restricciones } = useAppContext();

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
    <div>
      <button
        onClick={handleDownloadPDF}
        className="mb-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
      >
        Descargar PDF
      </button>

      {/* Contenedor de la página a convertir en PDF */}
      <div id="pdf-content" style={{ padding: '20px' }}>
        <h1 className="text-3xl font-bold mb-4">Informe de Restricciones</h1>
        <GraficoRestricciones />
        <ResumenRestriccionesPorResponsable />

        {/* Tabla de restricciones */}
        <div className="mt-6">
          <h2 className="text-2xl font-semibold mb-2">Listado de Restricciones</h2>
          {restricciones.length > 0 ? (
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
                {restricciones.map((restriccion: RestriccionesForm) => (
                  <tr key={restriccion._id || restriccion.id_restriccion}>
                    <td className="border border-gray-300 px-4 py-2">{restriccion.responsable}</td>
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
          ) : (
            <p>No hay restricciones disponibles.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default PageWithPDF;
