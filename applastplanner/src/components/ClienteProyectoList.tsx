import React from 'react';
import { useAppContext } from './Context';
import { Proyecto } from '../types/Proyecto';
import { useNavigate } from 'react-router-dom';

const ClienteProyectoList: React.FC = () => {
  const { clientes } = useAppContext();
  const navigate = useNavigate();

  const handleCrearRestricciones = (clienteId: string, proyectoId: string, clienteNombre: string, proyectoNombre: string) => {
    navigate(`/proyectos/${proyectoId}/restricciones`, {
      state: { clienteId, proyectoId, clienteNombre, proyectoNombre },
    });
  };

  return (
    <div className="p-4 bg-white shadow-md rounded-md">
      <h2 className="text-2xl font-bold mb-4">Listado de Clientes y Proyectos</h2>
      {clientes.map((cliente) => (
        <div key={cliente._id} className="mb-6 border-b pb-4">
          <h3 className="text-xl font-semibold">{cliente.nombre}</h3>
          {cliente.proyectos && cliente.proyectos.length > 0 ? (
            cliente.proyectos.map((proyecto: Proyecto) => (
              <div key={proyecto._id} className="ml-4 mt-2 p-2 border rounded-md">
                <p><strong>Proyecto:</strong> {proyecto.nombre}</p>
                <p><strong>Descripción:</strong> {proyecto.descripcion}</p>
                <div className="mt-2">
                  <button
                    onClick={() => handleCrearRestricciones(cliente._id, proyecto._id, cliente.nombre, proyecto.nombre)}
                    className="mr-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                  >
                    Crear Restricciones
                  </button>
                  <button
                    onClick={() => window.location.href = `/proyectos/${proyecto._id}/personal`}
                    className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
                  >
                    Crear Personal
                  </button>
                </div>
              </div>
            ))
          ) : (
            <p className="ml-4 mt-2">No hay proyectos asociados a este cliente.</p>
          )}
        </div>
      ))}
    </div>
  );
};

export default ClienteProyectoList;
