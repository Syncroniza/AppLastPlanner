import { useEffect, useState } from 'react';
import { useHormigones } from './HormigonesContext';
import { ResponsiveLine } from '@nivo/line';


interface ChartData {
  id: string;
  data: { x: string; y: number }[];
}

// Función para calcular la semana del año
const getWeek = (date: Date): number => {
  const tempDate = new Date(date.getTime());
  tempDate.setHours(0, 0, 0, 0);
  tempDate.setDate(tempDate.getDate() + 3 - ((tempDate.getDay() + 6) % 7));
  const week1 = new Date(tempDate.getFullYear(), 0, 4);
  return (
    1 +
    Math.round(
      ((tempDate.getTime() - week1.getTime()) / 86400000 - 3 + ((week1.getDay() + 6) % 7)) / 7
    )
  );
};

const CurvaHormigonChart = () => {
  const { curvaHormigones, hormigones, fetchCurvaHormigones } = useHormigones();
  const [dataForChart, setDataForChart] = useState<ChartData[]>([]);

  useEffect(() => {
    fetchCurvaHormigones(); // Obtener los datos
  }, [fetchCurvaHormigones]);

  useEffect(() => {
    const weekEndDate = (year: number, week: number): string => {
      const startOfYear = new Date(year, 0, 1); // Primer día del año
      const daysOffset = (week - 1) * 7; // Desplazamiento en días para la semana dada
      const weekStart = new Date(startOfYear.getTime() + daysOffset * 86400000); // Fecha aproximada
      
      // Ajustar para que sea el domingo de esa semana
      const dayOfWeek = weekStart.getDay();
      const diffToSunday = 7 - dayOfWeek; // Días restantes hasta el domingo
      weekStart.setDate(weekStart.getDate() + diffToSunday);
    
      return weekStart.toISOString().split("T")[0]; // Formato YYYY-MM-DD
    };
    if (curvaHormigones.length || hormigones.length) {
      const processData = (data: any[], key: string, dateKey: string) => {
        const dataByYearWeek = data.reduce<Record<string, { year: number; week: number; value: number }>>(
          (acc, item) => {
            const date = new Date(item[dateKey]);
            if (isNaN(date.getTime()) || typeof item[key] !== "number") return acc;

            const week = getWeek(date);
            const year = date.getFullYear();
            const keyName = `${year}-${week}`;

            if (!acc[keyName]) acc[keyName] = { year, week, value: 0 };
            acc[keyName].value += item[key];
            return acc;
          },
          {}
        );

        let acumulado = 0;

        // Ordenar por año y semana y acumular
        return Object.entries(dataByYearWeek)
          .sort(([a], [b]) => {
            const [yearA, weekA] = a.split("-").map(Number);
            const [yearB, weekB] = b.split("-").map(Number);
            return yearA - yearB || weekA - weekB;
          })
          .map(([_, { year, week, value }]) => {
            acumulado += value;
            return { x: weekEndDate(year, week), y: acumulado };
          });
      };

      const programadosAcumulados = processData(curvaHormigones, "Hg_Planificado", "fin");
      const realesAcumulados = processData(hormigones, "cantidad", "fecha");

      setDataForChart([
        { id: "Hg Programado", data: programadosAcumulados },
        { id: "Hg Real ", data: realesAcumulados },
      ]);

      console.log("Programado Acumulado:", programadosAcumulados);
      console.log("Real Acumulado:", realesAcumulados);
    }
  }, [curvaHormigones, hormigones]);

  if (dataForChart.length === 0) return <p>Cargando datos...</p>;

  return (
    <div style={{ height: "500px", width: "100%" }}>
      <ResponsiveLine
        data={dataForChart}
        margin={{ top: 50, right: 110, bottom: 110, left: 60 }}
        xScale={{
          type: "time",
          format: "%Y-%m-%d",
          useUTC: false,
          precision: "day",
        }}
        yScale={{ type: "linear", min: "auto", max: "auto", stacked: false }}
        axisBottom={{
          format: "%d/%m/%y",
          tickValues: "every 1 week",
          tickSize: 5,
          tickPadding: 5,
          tickRotation: -45,
          legend: "Semanas terminando el domingo",
          legendOffset: 70,
          legendPosition: "middle",
        }}
        axisLeft={{
          tickSize: 5,
          tickPadding: 5,
          legend: "Hormigón Acumulado (m³)",
          legendOffset: -50,
          legendPosition: "middle",
        }}
        colors={{ scheme: "nivo" }}
        pointSize={5}
        pointBorderWidth={2}
        pointBorderColor={{ from: "serieColor" }}
        useMesh={true}
        tooltip={({ point }) => {
          // Función para formatear fecha a dd/mm/yy
          const formatDate = (date: DatumValue): string => {
            const parsedDate = new Date(date as string | number | Date);
            if (isNaN(parsedDate.getTime())) return "Fecha inválida";
            return new Intl.DateTimeFormat("es-ES", {
              day: "2-digit",
              month: "2-digit",
              year: "2-digit",
            }).format(parsedDate);
          };
        
          // Fecha formateada
          const pointDate = formatDate(point.data.x);
          // Valor actual de la serie
          const hgValue = Number(point.data.y);
        
          // Buscar otra serie con la misma fecha
          const otherSeries = dataForChart.find((series) => series.id !== point.serieId);
          const otherPoint = otherSeries?.data.find(
            (p) => new Date(p.x as string).getTime() === new Date(point.data.x as string).getTime()
          );
        
          const otherValue = otherPoint ? Number(otherPoint.y) : null;
        
          return (
            <div
              style={{
                background: "white",
                padding: "10px",
                border: "1px solid #ccc",
                borderRadius: "4px",
              }}
            >
              <strong>Fecha: {pointDate}</strong>
              <div style={{ color: point.color }}>
                {point.serieId}: {hgValue} m³
              </div>
              {otherPoint && (
                <div style={{ color: "gray" }}>
                  {otherSeries?.id}: {otherValue} m³
                </div>
              )}
            </div>
          );
        }}
        legends={[
          {
            anchor: "bottom-right",
            direction: "column",
            translateX: 80,
            itemsSpacing: 2,
            itemWidth: 90,
            itemHeight: 20,
            itemOpacity: 0.75,
            symbolSize: 10,
            symbolShape: "circle",
          },
        ]}
      />
    </div>
  );
};

export default CurvaHormigonChart;