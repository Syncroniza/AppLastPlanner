import React, { useEffect, useState } from 'react';
import { ResponsiveBar } from '@nivo/bar';
import { useAppContext } from '../components/Context';

interface Agrupacion {
  responsable: string;
  total: number;
  abiertas: number;
  cerradas: number;
}

const ResumenRestriccionesPorResponsable: React.FC = () => {
  const { clienteId, proyectoId, getRestriccionesByProyecto } = useAppContext();
  const [agrupacion, setAgrupacion] = useState<Agrupacion[]>([]);

  useEffect(() => {
    if (proyectoId) {
      const restriccionesFiltradas = getRestriccionesByProyecto(proyectoId, clienteId || undefined);

      // Procesar restricciones filtradas para agruparlas por responsable
      const agrupacionPorResponsable = restriccionesFiltradas.reduce(
        (acc: Record<string, Agrupacion>, restriccion) => {
          const responsable =
            typeof restriccion.responsable === 'object' && restriccion.responsable !== null
              ? `${restriccion.responsable.nombre} ${restriccion.responsable.apellido}`
              : 'Sin asignar';

          if (!acc[responsable]) {
            acc[responsable] = {
              responsable,
              total: 0,
              abiertas: 0,
              cerradas: 0,
            };
          }
          acc[responsable].total += 1;
          if (restriccion.status === 'abierta') {
            acc[responsable].abiertas += 1;
          } else if (restriccion.status === 'cerrada') {
            acc[responsable].cerradas += 1;
          }
          return acc;
        },
        {}
      );

      setAgrupacion(Object.values(agrupacionPorResponsable));
    } else {
      setAgrupacion([]);
    }
  }, [proyectoId, clienteId, getRestriccionesByProyecto]);

  // Preparar los datos para Nivo
  const barData = agrupacion.map((item) => ({
    responsable: item.responsable,
    total: item.total,
    abiertas: item.abiertas,
    cerradas: item.cerradas,
  }));

  return (
    <div className="w-full h-screen">
      <h2 className="text-xl font-semibold mb-4 text-center">
        Resumen de Restricciones por Responsable
      </h2>
      <div style={{ height: '500px', width: '100%' }}>
        <ResponsiveBar
          data={barData}
          keys={['total', 'abiertas', 'cerradas']}
          indexBy="responsable"
          margin={{ top: 50, right: 130, bottom: 50, left: 150 }} // Aumentar margen izquierdo
          padding={0.3}
          // layout="horizontal"
          valueScale={{ type: 'linear' }}
          indexScale={{ type: 'band', round: true }}
          colors={{ scheme: 'nivo' }}
          borderColor={{ from: 'color', modifiers: [['darker', 1.6]] }}
          axisTop={null}
          axisRight={null}
          axisLeft={{
            tickSize: 5,
            tickPadding: 5,
            tickRotation: 0,
            legend: 'Restricciones',
            legendPosition: 'middle',
            legendOffset: -50,
          }}
          theme={{
            axis: {
              ticks: {
                text: {
                  fontSize: 14, // Aumentar tamaño de la fuente
                },
              },
            },
          }}
          legends={[
            {
              dataFrom: 'keys',
              anchor: 'bottom-right',
              direction: 'column',
              justify: false,
              translateX: 120,
              translateY: 0,
              itemsSpacing: 2,
              itemWidth: 100,
              itemHeight: 20,
              itemDirection: 'left-to-right',
              itemOpacity: 0.85,
              symbolSize: 20,
              effects: [
                {
                  on: 'hover',
                  style: {
                    itemOpacity: 1,
                  },
                },
              ],
            },
          ]}
          role="application"
          ariaLabel="Resumen de restricciones por responsable"
          barAriaLabel={(e) =>
            `${e.id}: ${e.formattedValue} en ${e.indexValue}`
          }
        />
      </div>
    </div>
  );
};

export default ResumenRestriccionesPorResponsable;
