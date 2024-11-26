import React, { useEffect, useState } from 'react';
import { Pie } from 'react-chartjs-2';
import { useAppContext } from './Context';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
} from 'chart.js';
import { RestriccionesForm } from '../types/Restricciones';

// Registrar los elementos de Chart.js
ChartJS.register(ArcElement, Tooltip, Legend);

interface GraficoRestriccionesProps {
  proyectoId: string;
  clienteId?: string; // El clienteId es opcional
}

const GraficoRestricciones: React.FC<GraficoRestriccionesProps> = ({ proyectoId, clienteId }) => {
  const { getRestriccionesByProyecto } = useAppContext();
  const [restriccionesFiltradas, setRestriccionesFiltradas] = useState<RestriccionesForm[]>([]);
  console.log("restriccionesFiltradas",restriccionesFiltradas)

  // Filtrar las restricciones al cargar el componente o cuando cambien los props
  useEffect(() => {
    if (proyectoId) {
      const restricciones = getRestriccionesByProyecto(proyectoId, clienteId);
      setRestriccionesFiltradas(restricciones);
    } else {
      console.warn('No se recibió un proyectoId válido');
    }
  }, [proyectoId, clienteId, getRestriccionesByProyecto]);

  // Contar restricciones abiertas y cerradas
  const abiertas = restriccionesFiltradas.filter((r) => r.status === 'abierta').length;
  console.log("abiertas",abiertas)
  const cerradas = restriccionesFiltradas.filter((r) => r.status === 'cerrada').length;
  const total = abiertas + cerradas;

  // Configuración de los datos para el gráfico
  const data = {
    labels: ['Abiertas', 'Cerradas'],
    datasets: [
      {
        label: 'Estado de Restricciones',
        data: [abiertas, cerradas],
        backgroundColor: ['#FF6384', '#36A2EB'],
        hoverBackgroundColor: ['#FF6384', '#36A2EB'],
      },
    ],
  };

  return (
    <div style={{ width: '25%', margin: '0 auto' }}>
      <h2 className="text-2xl font-bold mb-4">Resumen de Restricciones</h2>
      <p className="mt-4 text-2xl font-semibold">Total de restricciones: {total}</p>
      <Pie data={data} />
    </div>
  );
};

export default GraficoRestricciones;
