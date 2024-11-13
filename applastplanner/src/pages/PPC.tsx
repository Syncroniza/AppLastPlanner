import React from 'react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import GraficoRestricciones from '../components/GraficoRestricciones';
import ResumenRestriccionesPorResponsable from '../components/ResumenRestriccionesPorResponsable';

const PageWithPDF: React.FC = () => {
  const handleDownloadPDF = async () => {
    const input = document.getElementById('pdf-content');
    if (input) {
      const canvas = await html2canvas(input);
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'pt',
        format: [canvas.width, canvas.height],
      });
      pdf.addImage(imgData, 'PNG', 0, 0, canvas.width, canvas.height);
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
      <div id="pdf-content">
        <GraficoRestricciones />
        <ResumenRestriccionesPorResponsable />
      </div>
    </div>
  );
};

export default PageWithPDF;
