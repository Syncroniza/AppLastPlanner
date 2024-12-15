import React, { useEffect, useState } from "react";
import { useHormigones } from "./HormigonesContext";
import { useAppContext } from "./Context";

// Tipo para las filas de la tabla de comparación
interface ComparacionHormigones {
  semana: string;
  Hg_Planificado: number;
  Hg_Real: number;
}

const CurvaHormigonList: React.FC = () => {
  const { curvaHormigones, fetchCurvaHormigones, hormigones, fetchHormigones } = useHormigones();
  const { clienteId, proyectoId } = useAppContext();
  const [hormigonesPorSemana, setHormigonesPorSemana] = useState<ComparacionHormigones[]>([]);

  useEffect(() => {
    console.log("Hormigones reales:", hormigones); // Verifica el formato de los datos reales
    console.log("Curvas de hormigón:", curvaHormigones); // Verifica las curvas planificadas
    if (curvaHormigones.length > 0 && hormigones.length > 0) {
      calcularHormigonesPorSemana();
    }
  }, [curvaHormigones, hormigones]);



  // Fetch inicial de curvas y hormigones
  useEffect(() => {
    if (clienteId && proyectoId) {
      fetchCurvaHormigones(clienteId, proyectoId);
      fetchHormigones(clienteId, proyectoId);
    }
  }, [clienteId, proyectoId, fetchCurvaHormigones, fetchHormigones]);
  

  // Procesar hormigones reales por semana y compararlos con los planificados
  useEffect(() => {
    if (curvaHormigones.length > 0 && hormigones.length > 0) {
      calcularHormigonesPorSemana();
    }
  }, [curvaHormigones, hormigones]);

  const calcularHormigonesPorSemana = () => {
  const formatFecha = (fecha: Date): string => {
    const dia = fecha.getUTCDate().toString().padStart(2, "0");
    const mes = (fecha.getUTCMonth() + 1).toString().padStart(2, "0");
    const anio = fecha.getUTCFullYear().toString().slice(-2); // Últimos 2 dígitos del año
    return `${dia}/${mes}/${anio}`;
  };

  const obtenerRangoSemana = (fecha: Date): { inicio: Date; fin: Date } => {
    const inicio = new Date(fecha);
    inicio.setUTCDate(fecha.getUTCDate() - fecha.getUTCDay() + 1); // Lunes
    inicio.setUTCHours(0, 0, 0, 0);

    const fin = new Date(inicio);
    fin.setUTCDate(inicio.getUTCDate() + 6); // Domingo
    fin.setUTCHours(23, 59, 59, 999);

    return { inicio, fin };
  };

  // Agrupar hormigones reales por semana
  const hormigonesAgrupadosPorSemana = hormigones.reduce((grupo, hormigon) => {
    const fechaHormigon = new Date(hormigon.fecha);
    const { inicio, fin } = obtenerRangoSemana(fechaHormigon);

    const rango = `${formatFecha(inicio)} - ${formatFecha(fin)}`;
    if (!grupo[rango]) {
      grupo[rango] = 0;
    }
    grupo[rango] += hormigon.cantidad;
    return grupo;
  }, {} as Record<string, number>);

  // Procesar curvas de hormigones y combinar con reales
  const hormigonesAgrupados = curvaHormigones.map((curva) => {
    const inicio = new Date(curva.inicio);
    const fin = new Date(curva.fin);
    const rango = `${formatFecha(inicio)} - ${formatFecha(fin)}`;

    // Buscar el valor real en el rango semanal
    const sumaHgReal = hormigonesAgrupadosPorSemana[rango] || 0;

    return {
      semana: rango,
      Hg_Planificado: curva.Hg_Planificado,
      Hg_Real: sumaHgReal,
    };
  });

  setHormigonesPorSemana(hormigonesAgrupados);
};

  const obtenerSemana = (fecha: Date): string => {
    const primerDiaSemana = new Date(fecha);
    primerDiaSemana.setDate(fecha.getDate() - fecha.getDay()); // Lunes
    const ultimoDiaSemana = new Date(fecha);
    ultimoDiaSemana.setDate(fecha.getDate() + (6 - fecha.getDay())); // Domingo
    return `${primerDiaSemana.toLocaleDateString()} - ${ultimoDiaSemana.toLocaleDateString()}`;
  };

  return (
    <div style={listContainerStyle}>
      <h2>Comparación de Hormigones Planificados vs Reales</h2>
      {hormigonesPorSemana.length === 0 ? (
        <p>No hay datos disponibles para mostrar.</p>
      ) : (
        <table style={tableStyle}>
          <thead>
            <tr>
              <th>Semana</th>
              <th>Hg Planificado (kg)</th>
              <th>Hg Real (kg)</th>
            </tr>
          </thead>
          <tbody>
            {hormigonesPorSemana.map((hormigon, index) => (
              <tr key={index}>
                <td>{hormigon.semana}</td>
                <td>{hormigon.Hg_Planificado}</td>
                <td>{hormigon.Hg_Real}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

// Estilos simples para la lista
const listContainerStyle: React.CSSProperties = {
  maxWidth: "800px",
  margin: "20px auto",
  padding: "20px",
  border: "1px solid #ccc",
  borderRadius: "5px",
  backgroundColor: "#fff",
};

const tableStyle: React.CSSProperties = {
  width: "100%",
  borderCollapse: "collapse",
};

export default CurvaHormigonList;