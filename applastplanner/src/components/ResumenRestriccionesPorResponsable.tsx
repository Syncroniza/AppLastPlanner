import React, { useEffect, useState } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';
import { useAppContext } from '../components/Context';

// Registra los componentes necesarios de Chart.js
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

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
            restriccion.responsable && restriccion.responsable.nombre && restriccion.responsable.apellido
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

  const chartData = {
    labels: agrupacion.map((item) => item.responsable),
    datasets: [
      {
        label: 'Total de Restricciones',
        data: agrupacion.map((item) => item.total),
        backgroundColor: 'rgba(75, 192, 192, 0.6)',
      },
      {
        label: 'Restricciones Abiertas',
        data: agrupacion.map((item) => item.abiertas),
        backgroundColor: 'rgba(255, 99, 132, 0.6)',
      },
      {
        label: 'Restricciones Cerradas',
        data: agrupacion.map((item) => item.cerradas),
        backgroundColor: 'rgba(54, 162, 235, 0.6)',
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: 'Resumen de Restricciones por Responsable',
      },
    },
    scales: {
      x: {
        title: {
          display: true,
          text: 'Responsables',
        },
      },
      y: {
        title: {
          display: true,
          text: 'Número de Restricciones',
        },
        beginAtZero: true,
      },
    },
  };

  return (
    <div className="w-full overflow-x-auto">
      <h2 className="text-xl font-semibold mb-4 text-center">Resumen de Restricciones por Responsable</h2>
      <div className="relative" style={{ height: '400px', width: '100%' }}>
        <Bar data={chartData} options={chartOptions} />
      </div>
    </div>
  );
};

export default ResumenRestriccionesPorResponsable;
