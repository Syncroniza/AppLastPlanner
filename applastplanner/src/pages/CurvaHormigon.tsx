import React, { useRef } from "react";
import CurvaHormigonChart from "../components/CurvaHormigonChart";
import CurvaHormigonList from "../components/CurvaHormigonList";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { useAppContext } from "../components/Context";

function CurvaHormigon() {
  const componentRef = useRef<HTMLDivElement>(null);

  // Obtener el nombre del proyecto desde el contexto
  const { proyectoId, proyectos } = useAppContext();
  const proyectoNombre =
    proyectos.find((proyecto) => proyecto._id === proyectoId)?.nombre ||
    "Proyecto no seleccionado";

  const exportToPDF = async () => {
    if (componentRef.current) {
      const canvas = await html2canvas(componentRef.current, { scale: 2 });
      const imgData = canvas.toDataURL("image/png");

      // Fecha y hora actual del reporte
      const reportDate = new Date();
      const formattedDate = reportDate.toLocaleDateString();
      const formattedTime = reportDate.toLocaleTimeString();

      // Configuración de jsPDF
      const pdf = new jsPDF("p", "mm", "a4");
      const pdfWidth = pdf.internal.pageSize.getWidth() - 20;
      const pdfHeight = pdf.internal.pageSize.getHeight() - 20;

      // Agregar título y fecha al PDF
      pdf.setFontSize(16);
      pdf.text(`Reporte: ${proyectoNombre}`, 10, 15);
      pdf.setFontSize(12);
      pdf.text(`Fecha: ${formattedDate} ${formattedTime}`, 10, 25);

      let imgWidth = canvas.width;
      let imgHeight = canvas.height;
      const ratio = imgWidth / imgHeight;
      const scaledHeight = pdfWidth / ratio;

      let yPosition = 35;
      let remainingHeight = scaledHeight;

      while (remainingHeight > 0) {
        pdf.addImage(
          imgData,
          "PNG",
          10,
          yPosition,
          pdfWidth,
          Math.min(remainingHeight, pdfHeight - yPosition)
        );

        remainingHeight -= pdfHeight - yPosition;

        if (remainingHeight > 0) {
          pdf.addPage();
          yPosition = 10;
        }
      }

      // Guardar PDF con nombre del proyecto
      const fileName = `reporte_${proyectoNombre.replace(/\s/g, "_")}.pdf`;
      pdf.save(fileName);
    }
  };

  return (
    <div style={containerStyle}>
      <div style={chartContainerStyle}>
        <button onClick={exportToPDF} style={buttonStyle}>
          Exportar a PDF
        </button>
        <div style={headerStyle}>
          <h2>{`Reporte: ${proyectoNombre}`}</h2>
          <h4>{`Fecha de Creación: ${new Date().toLocaleDateString()}`}</h4>
        </div>
        <div ref={componentRef} style={pdfContentStyle}>
          <CurvaHormigonList />
          <CurvaHormigonChart />
        </div>
      </div>
    </div>
  );
}

// Estilos
const containerStyle: React.CSSProperties = {
  width: "100vw",
  height: "100vh",
  display: "flex",
  justifyContent: "center",
  alignItems: "flex-start",
  padding: "10px",
  boxSizing: "border-box",
};

const chartContainerStyle: React.CSSProperties = {
  width: "100%",
  maxWidth: "1200px",
};

const headerStyle: React.CSSProperties = {
  marginBottom: "10px",
  textAlign: "center",
};

const pdfContentStyle: React.CSSProperties = {
  padding: "20px",
  backgroundColor: "white",
};

const buttonStyle: React.CSSProperties = {
  marginBottom: "10px",
  padding: "10px 20px",
  fontSize: "16px",
  cursor: "pointer",
  backgroundColor: "#007BFF",
  color: "white",
  border: "none",
  borderRadius: "5px",
};

export default CurvaHormigon;