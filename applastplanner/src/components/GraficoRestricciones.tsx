import React, { useEffect, useState } from 'react';
import { Pie } from 'react-chartjs-2';
import { useAppContext } from './Context'; // Asegúrate de que esta ruta sea correcta
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
} from 'chart.js';

// Registrar los elementos de Chart.js
ChartJS.register(ArcElement, Tooltip, Legend);

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
    <div style={{ width: '80%', margin: '0 auto' }}>
      <p className="mt-4 text-xl font-semibold text-center">Total de restricciones: {total}</p>
      <Pie data={data} />
    </div>
  );
};

export default GraficoRestricciones;
