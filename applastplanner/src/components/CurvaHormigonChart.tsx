import React, { useEffect, useState } from 'react';
import { useHormigones } from './HormigonesContext';
import { ResponsiveLine } from '@nivo/line';

interface WeekData {
  week: number;
  parcial: number;
  acumulado: number;
}

type ChartData = {
  id: string;
  data: { x: string; y: number }[];
}[];

const CurvaHormigonChart = () => {
  const { curvaHormigones, hormigones, fetchCurvaHormigones } = useHormigones();
  const [dataForChart, setDataForChart] = useState<ChartData>([]);

  useEffect(() => {
    fetchCurvaHormigones(); // Asegúrate de obtener los datos necesarios
  }, [fetchCurvaHormigones]);

  useEffect(() => {
    if (curvaHormigones.length || hormigones.length) {
      const processData = (data: any[], label: string) => {
        const dataByYearWeek = data.reduce<Record<string, WeekData>>((acc, item) => {
          const date = new Date(item.fin);
          const week = date.getWeek();
          const year = date.getFullYear();
          const key = `${year}-${week}`; // Clave única por año y semana
  
          if (!acc[key]) {
            acc[key] = { week, parcial: 0, acumulado: 0 };
          }
  
          // Sumar el valor real o planificado, verificando que sea un número válido
          const value = item.Hg_Planificado ?? item.Hg_Real ?? 0;
          if (typeof value === 'number' && !isNaN(value)) {
            acc[key].parcial += value;
          }
  
          return acc;
        }, {});
  
        let acumulado = 0;
        const formattedData = Object.entries(dataByYearWeek)
          .sort(([keyA], [keyB]) => {
            const [yearA, weekA] = keyA.split('-').map(Number);
            const [yearB, weekB] = keyB.split('-').map(Number);
            return yearA - yearB || weekA - weekB;
          })
          .map(([_, weekData]) => {
            acumulado += weekData.parcial;
            return { ...weekData, acumulado };
          });
  
        // Validar y filtrar datos antes de construir el gráfico
        const parcialData = formattedData
          .filter(week => week.parcial !== null && !isNaN(week.parcial)) // Filtrar valores inválidos
          .map(week => ({
            x: `Week ${week.week}`,
            y: week.parcial,
          }));
  
        const acumuladoData = formattedData
          .filter(week => week.acumulado !== null && !isNaN(week.acumulado)) // Filtrar valores inválidos
          .map(week => ({
            x: `Week ${week.week}`,
            y: week.acumulado,
          }));
  
        return {
          parcialData,
          acumuladoData,
          label,
        };
      };
  
      const planificados = processData(curvaHormigones, 'Hormigón Planificado');
      const reales = processData(hormigones, 'Hormigón Real');
  
      // Verificar los datos antes de establecer el estado
      console.log('Datos procesados:', { planificados, reales });
  
      setDataForChart([
        { id: `${planificados.label} Parcial`, data: planificados.parcialData },
        { id: `${planificados.label} Acumulado`, data: planificados.acumuladoData },
        { id: `${reales.label} Parcial`, data: reales.parcialData },
        { id: `${reales.label} Acumulado`, data: reales.acumuladoData },
      ]);
    }
  }, [curvaHormigones, hormigones]);

  
  if (dataForChart.length === 0) {
    return <p>Loading data...</p>;
  }

  return (
    <div
      style={{
        width: '100vw',
        height: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        padding: '10px',
        boxSizing: 'border-box',
      }}
    >
      <ResponsiveLine
        data={dataForChart}
        margin={{ top: 50, right: 110, bottom: 50, left: 60 }}
        xScale={{ type: 'point' }}
        yScale={{ type: 'linear', min: 'auto', max: 'auto', stacked: false, reverse: false }}
        axisTop={null}
        axisRight={null}
        axisBottom={{
          tickSize: 5,
          tickPadding: 5,
          tickRotation: 0,
          legend: 'Week',
          legendOffset: 36,
          legendPosition: 'middle',
        }}
        axisLeft={{
          tickSize: 5,
          tickPadding: 5,
          tickRotation: 0,
          legend: 'Hormigón (m³)',
          legendOffset: -40,
          legendPosition: 'middle',
        }}
        pointSize={10}
        pointColor={{ theme: 'background' }}
        pointBorderWidth={2}
        pointBorderColor={{ from: 'serieColor' }}
        useMesh={true}
        colors={{ scheme: 'nivo' }}
        lineWidth={3}
      />
    </div>
  );
};

// Añadir el método getWeek al prototipo de Date
Date.prototype.getWeek = function (): number {
  const date = new Date(this.getTime());
  date.setHours(0, 0, 0, 0);
  date.setDate(date.getDate() + 3 - ((date.getDay() + 6) % 7));
  const week1 = new Date(date.getFullYear(), 0, 4);
  return (
    1 +
    Math.round(
      ((date.getTime() - week1.getTime()) / 86400000 - 3 + ((week1.getDay() + 6) % 7)) / 7
    )
  );
};

export default CurvaHormigonChart;