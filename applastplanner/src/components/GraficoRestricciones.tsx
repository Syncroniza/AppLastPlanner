import React, { useEffect, useState } from 'react';
import { ResponsivePie } from '@nivo/pie';
import { useAppContext } from './Context'; // Asegúrate de que esta ruta sea correcta

const GraficoRestricciones: React.FC = () => {
  const { getRestriccionesByProyecto, proyectoId, clienteId } = useAppContext();
  const [restriccionesFiltradas, setRestriccionesFiltradas] = useState<any[]>([]);

  console.log('Restricciones para el gráfico:', restriccionesFiltradas);

  // Obtener las restricciones filtradas desde el contexto
  useEffect(() => {
    if (proyectoId) {
      const restricciones = getRestriccionesByProyecto(proyectoId, clienteId || undefined);
      setRestriccionesFiltradas(restricciones);
    } else {
      console.warn('No se encontró proyectoId para filtrar restricciones en el gráfico');
    }
  }, [proyectoId, clienteId, getRestriccionesByProyecto]);

  // Verificar si restriccionesFiltradas es válida y no está vacía
  if (!restriccionesFiltradas || restriccionesFiltradas.length === 0) {
    return (
      <div style={{ width: '100%', margin: '0 auto' }}>
        <h2 className="text-xl font-bold mb-4">Resumen de Restricciones</h2>
        <p className="mt-4 text-xl">No hay restricciones disponibles para graficar.</p>
      </div>
    );
  }

  // Filtrar y contar las restricciones abiertas y cerradas
  const abiertas = restriccionesFiltradas.filter((r) => r.status === 'abierta').length;
  console.log("Abiertas:", abiertas);
  const cerradas = restriccionesFiltradas.filter((r) => r.status === 'cerrada').length;
  const total = abiertas + cerradas;

  // Datos para el gráfico de torta
  const pieData = [
    { id: 'Abiertas', label: 'Abiertas', value: abiertas, color: '#FF6384' },
    { id: 'Cerradas', label: 'Cerradas', value: cerradas, color: '#36A2EB' },
  ];

  return (
    <div style={{ width: '80%', margin: '0 auto' }}>
      <p className="mt-4 text-xl font-semibold text-center">Total de restricciones: {total}</p>
      <div style={{ height: 400 }}>
        <ResponsivePie
          data={pieData}
          margin={{ top: 40, right: 80, bottom: 80, left: 80 }}
          innerRadius={0.5}
          padAngle={0.7}
          cornerRadius={3}
          colors={{ datum: 'data.color' }}
          borderWidth={1}
          borderColor={{ from: 'color', modifiers: [['darker', 0.2]] }}
          radialLabelsSkipAngle={10}
          radialLabelsTextColor="#333333"
          radialLabelsLinkColor={{ from: 'color' }}
          sliceLabelsSkipAngle={10}
          sliceLabelsTextColor="#333333"
          legends={[
            {
              anchor: 'bottom',
              direction: 'row',
              justify: false,
              translateX: 0,
              translateY: 56,
              itemsSpacing: 0,
              itemWidth: 100,
              itemHeight: 18,
              itemTextColor: '#999',
              itemDirection: 'left-to-right',
              itemOpacity: 1,
              symbolSize: 18,
              symbolShape: 'circle',
              effects: [
                {
                  on: 'hover',
                  style: {
                    itemTextColor: '#000',
                  },
                },
              ],
            },
          ]}
        />
      </div>
    </div>
  );
};

export default GraficoRestricciones;
