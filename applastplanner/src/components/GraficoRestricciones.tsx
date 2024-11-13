import React from 'react';
import { Pie } from 'react-chartjs-2';
import { useAppContext } from './Context';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
} from 'chart.js';

// Registrar los elementos de Chart.js
ChartJS.register(ArcElement, Tooltip, Legend);

const GraficoRestricciones: React.FC = () => {
  const { restricciones } = useAppContext();

  // Filtrar y contar las restricciones abiertas y cerradas
  const abiertas = restricciones.filter((r) => r.status === 'abierta').length;
  const cerradas = restricciones.filter((r) => r.status === 'cerrada').length;
  const total = abiertas + cerradas;

  // Datos para el gráfico de torta
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
