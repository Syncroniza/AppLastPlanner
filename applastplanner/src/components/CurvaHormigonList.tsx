import React, { useEffect, useState } from "react";
import { useHormigones } from "./HormigonesContext";
import { useAppContext } from "./Context";
import { parseISO, startOfISOWeek, format, endOfISOWeek } from 'date-fns';
import { HormigonData } from "../types/HormigonData"
import { ComparacionHormigones } from "../types/Comparacionhormigones";
import { CurvaHormigonData } from "../types/Curvahormigondata";



// Funciones Auxiliares
const esFechaValida = (fechaStr: string): boolean => {
  const fecha = parseISO(fechaStr);
  if (isNaN(fecha.getTime())) {
    console.error(`Fecha inválida: ${fechaStr}`);
    return false;
  }
  return true;
};
// Generacion de etiquetas 
const generarEtiquetaSemana = (inicioStr: string): string => {
  if (!esFechaValida(inicioStr)) {
    return "Semana Inválida";
  }

  const fecha = parseISO(inicioStr);
  const inicioSemana = startOfISOWeek(fecha);
  const finSemana = endOfISOWeek(fecha);

  const inicioFormateado = format(inicioSemana, 'dd/MM/yyyy');
  const finFormateado = format(finSemana, 'dd/MM/yyyy');

  return `${inicioFormateado} - ${finFormateado}`;
};


// Agrupa Hormigones por semana 
const agruparHormigonesPorSemana = (hormigones: HormigonData[]): Record<string, number> => {
  const agrupados: Record<string, number> = {};

  hormigones.forEach((hormigon) => {
    if (!hormigon.fecha) {
      console.warn("Hormigón sin fecha:", hormigon);
      return;
    }

    if (!esFechaValida(hormigon.fecha)) {
      console.warn("Hormigón con fecha inválida:", hormigon);
      return;
    }

    const inicioSemana = startOfISOWeek(parseISO(hormigon.fecha));
    const inicioStr = format(inicioSemana, 'yyyy-MM-dd'); // Clave consistente

    if (!agrupados[inicioStr]) {
      agrupados[inicioStr] = 0;
    }
    agrupados[inicioStr] += Number(hormigon.cantidad);
  });

  return agrupados;
};

const combinarPlanificadoConReal = (
  curvaHormigones: CurvaHormigonData[],
  hormigonesRealesPorSemana: Record<string, number>
): ComparacionHormigones[] => {
  const mapaSemanas = new Map<string, ComparacionHormigones>();

  // Añadir datos planificados al mapa
  curvaHormigones.forEach(curva => {
    const inicioStr = format(parseISO(curva.inicio), 'yyyy-MM-dd');
    const etiquetaSemana = generarEtiquetaSemana(inicioStr);

    if (!mapaSemanas.has(etiquetaSemana)) {
      mapaSemanas.set(etiquetaSemana, {
        semana: etiquetaSemana,
        Hg_Planificado: Number(curva.Hg_Planificado) || 0,
        Hg_Real: 0,
        inicioSemana: inicioStr,
      });
    } else {
      // Sumar valores si ya existe
      const existente = mapaSemanas.get(etiquetaSemana)!;
      existente.Hg_Planificado += Number(curva.Hg_Planificado) || 0;
    }
  });

  // Añadir datos reales al mapa
  Object.entries(hormigonesRealesPorSemana).forEach(([inicioStr, Hg_Real]) => {
    const etiquetaSemana = generarEtiquetaSemana(inicioStr);

    if (!mapaSemanas.has(etiquetaSemana)) {
      mapaSemanas.set(etiquetaSemana, {
        semana: etiquetaSemana,
        Hg_Planificado: 0,
        Hg_Real: Hg_Real || 0,
        inicioSemana: inicioStr,
      });
    } else {
      // Sumar valores si ya existe
      const existente = mapaSemanas.get(etiquetaSemana)!;
      existente.Hg_Real += Hg_Real || 0;
    }
  });

  // Convertir el mapa a un arreglo y ordenar por fecha
  return Array.from(mapaSemanas.values()).sort((a, b) => {
    return new Date(a.inicioSemana).getTime() - new Date(b.inicioSemana).getTime();
  });
};
const calcularAcumulados = (datos: ComparacionHormigones[]): ComparacionHormigones[] => {
  let acumuladoPlanificado = 0;
  let acumuladoReal = 0;

  return datos.map((item) => {
    acumuladoPlanificado += item.Hg_Planificado;
    acumuladoReal += item.Hg_Real;

    return {
      ...item,
      Hg_Planificado_Acumulado: acumuladoPlanificado,
      Hg_Real_Acumulado: acumuladoReal,
    };
  });
};

// --------------------------------------------------------------------------------------//

const CurvaHormigonList: React.FC = () => {
  const { curvaHormigones, fetchCurvaHormigones, hormigones, fetchHormigones } = useHormigones();
  const { clienteId, proyectoId } = useAppContext();
  const [hormigonesPorSemana, setHormigonesPorSemana] = useState<ComparacionHormigones[]>([]);

  useEffect(() => {
    if (clienteId && proyectoId) {
      fetchCurvaHormigones(clienteId, proyectoId);
      fetchHormigones(clienteId, proyectoId);
    }
  }, [clienteId, proyectoId, fetchCurvaHormigones, fetchHormigones]);

  useEffect(() => {
    if (curvaHormigones.length > 0 && hormigones.length > 0) {
      calcularHormigonesPorSemana();
    }
  }, [curvaHormigones, hormigones]);

  const calcularHormigonesPorSemana = () => {
    const hormigonesRealesPorSemana = agruparHormigonesPorSemana(hormigones);
    const hormigonesAgrupados = combinarPlanificadoConReal(curvaHormigones, hormigonesRealesPorSemana);
    const hormigonesConAcumulados = calcularAcumulados(hormigonesAgrupados);
    setHormigonesPorSemana(hormigonesConAcumulados);
  };

  return (
    <div className="max-w-6xl mx-auto p-4 bg-white rounded-lg shadow-lg">
      <h2 className="text-l font-semibold mb-4 text-gray-800">Comparación de Hormigones Planificados vs Reales</h2>
      {hormigonesPorSemana.length === 0 ? (
        <p className="text-gray-500">No hay datos disponibles para mostrar.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full border border-gray-200 rounded-lg text-sm text-gray-700">
            <thead className="bg-gray-100 text-gray-600 uppercase text-sm">
              <tr>
                <th className="px-4 py-2 text-left text-xs">Semana</th>
                <th className="px-4 py-2 text-center text-xs ">Hg Planificado (m³)</th>
                <th className="px-4 py-2 text-center text-xs">Hg Planificado Acumulado (m³)</th>
                <th className="px-4 py-2 text-center text-xs">Hg Real (m³)</th>
                <th className="px-4 py-2 text-center text-xs">Hg Real Acumulado (m³)</th>
              </tr>
            </thead>
            <tbody>
              {hormigonesPorSemana.map((hormigon) => (
                <tr key={hormigon.inicioSemana} className="hover:bg-gray-50">
                  <td className="px-4 py-1 text-xs">{hormigon.semana}</td>
                  <td className="px-4 py-1 text-xs text-center">{hormigon.Hg_Planificado}</td>
                  <td className="px-4 py-1 text-xs text-center">{hormigon.Hg_Planificado_Acumulado}</td>
                  <td
                    className={`px-4 py-1 text-xs text-center ${
                      hormigon.Hg_Real < hormigon.Hg_Planificado ? "text-red-600" : "text-green-600"
                    }`}
                  >
                    {hormigon.Hg_Real}
                  </td>
                  <td className="px-4 py-1 text-xs text-center">{hormigon.Hg_Real_Acumulado}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
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

// Estilos para la tabla
const tableStyle: React.CSSProperties = {
  width: "100%",
  borderCollapse: "collapse",
  textAlign: "left",
  border: "1px solid #ddd",
};

export default CurvaHormigonList;