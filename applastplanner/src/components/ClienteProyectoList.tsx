import React from 'react';
import { useAppContext } from './Context';
import { Proyecto } from '../types/Proyecto';
import { useNavigate } from 'react-router-dom';

const ClienteProyectoList: React.FC = () => {
  const { clientes, setClienteId, clienteId, setProyectoId, getRestriccionesByProyecto } = useAppContext();
  const navigate = useNavigate();

  const handleCrearRestricciones = (
    clienteId?: string,
    proyectoId?: string,
    clienteNombre?: string,
    proyectoNombre?: string
  ) => {
    if (!clienteId || !proyectoId) return;
    setClienteId(clienteId);
    setProyectoId(proyectoId);
    navigate(`/proyectos/${proyectoId}/restricciones`, {
      state: { clienteId, proyectoId, clienteNombre, proyectoNombre },
    });
  };

  const handleCrearPersonal = (proyectoId?: string) => {
    if (!proyectoId) return;
    navigate(`/proyectos/${proyectoId}/personal`);
  };

 const calculateStats = (proyectoId: string, clienteId?: string) => {
  // Filtrar las restricciones por proyectoId y clienteId
  const restricciones = getRestriccionesByProyecto(proyectoId, clienteId);

  console.log(`Restricciones para proyectoId ${proyectoId}:`, restricciones);

  // Total de restricciones
  const total = restricciones.length;

  // Filtrar restricciones abiertas
  const abiertas = restricciones.filter((r) => r.status === 'abierta').length;

  // Filtrar restricciones cerradas
  const cerradas = restricciones.filter((r) => r.status === 'cerrada').length;

  // Filtrar restricciones pasadas de la fecha de compromiso (no cerradas)
  const pasadasFecha = restricciones.filter(
    (r) =>
      r.fechacompromiso &&
      new Date(r.fechacompromiso) < new Date() && // Fecha de compromiso pasada
      r.status !== 'cerrada' // No incluir cerradas
  ).length;

  console.log(`Estadísticas para proyectoId ${proyectoId}:`, {
    total,
    abiertas,
    cerradas,
    pasadasFecha,
  });

  return { total, abiertas, cerradas, pasadasFecha };
};


  if (!clientes || clientes.length === 0) {
    return (
      <div className="p-4 bg-white shadow-md rounded-md">
        <h2 className="text-2xl font-bold mb-4">Listado de Clientes y Proyectos</h2>
        <p>No hay clientes disponibles en este momento.</p>
      </div>
    );
  }

  return (
    <div className="p-4 bg-slate-100 shadow-md rounded-md w-full ">
      <h2 className="text-2xl font-bold mb-4">Listado de Clientes y Proyectos</h2>
      {/* Contenedor principal responsivo */}
      <div className="">
        {clientes.map((cliente) => (
          <div key={cliente._id} className="p-4 border rounded-md bg-gray-200 shadow-sm mt-4">
            <h3 className="text-xl text-blue-500 font-semibold">{cliente.nombre}</h3>
            {cliente.proyectos && cliente.proyectos.length > 0 ? (
              cliente.proyectos.map((proyecto: Proyecto) => {
                const stats = calculateStats(proyecto._id, cliente._id);

                return (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4" key={proyecto._id}>
                    {/* Columna 1: Proyecto, Descripción y Botones */}
                    <div>
                      <p className="text-xl font-semibold mb-2">
                        <strong>Proyecto:</strong> {proyecto.nombre}
                      </p>
                      <p className="text-lg mb-4">
                        <strong>Descripción:</strong> {proyecto.descripcion}
                      </p>
                      <div className="flex space-x-4">
                        <button
                          onClick={() =>
                            handleCrearRestricciones(
                              cliente._id,
                              proyecto._id,
                              cliente.nombre,
                              proyecto.nombre
                            )
                          }
                          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                        >
                          Crear Restricciones
                        </button>
                        <button
                          onClick={() => handleCrearPersonal(proyecto._id)}
                          className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
                        >
                          Crear Personal
                        </button>
                      </div>
                    </div>
                
                    {/* Columna 2: Estadísticas */}
                    <div className="p-4 bg-gray-100 rounded-md shadow-sm">
                      <p className="text-lg">
                        <strong>Total Restricciones:</strong> {stats.total}
                      </p>
                      <p className="text-lg">
                        <strong>Abiertas:</strong> {stats.abiertas}
                      </p>
                      <p className="text-lg">
                        <strong>Cerradas:</strong> {stats.cerradas}
                      </p>
                      <p className="text-lg text-red-500 font-bold">
                        <strong>Pasadas de Fecha:</strong> {stats.pasadasFecha}
                      </p>
                    </div>
                  </div>
                );
                
              })
            ) : (
              <p className="mt-2">No hay proyectos asociados a este cliente.</p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ClienteProyectoList;
