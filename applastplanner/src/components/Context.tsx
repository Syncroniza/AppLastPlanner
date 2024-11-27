import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';
import { Personal } from '../types/Personal';
import { RestriccionesForm } from '../types/Restricciones';
import { Cliente } from '../types/Cliente';
import { Proyecto } from '../types/Proyecto';
import API from '../api';

interface AppContextProps {
  clienteId: string | null;
  setClienteId: React.Dispatch<React.SetStateAction<string | null>>;
  proyectoId: string | null;
  setProyectoId: React.Dispatch<React.SetStateAction<string | null>>;
  clientes: Cliente[];
  setClientes: React.Dispatch<React.SetStateAction<Cliente[]>>;
  proyectos: Proyecto[];
  setProyectos: React.Dispatch<React.SetStateAction<Proyecto[]>>;
  equipoData: Personal[];
  setEquipoData: React.Dispatch<React.SetStateAction<Personal[]>>;
  restricciones: RestriccionesForm[];
  setRestricciones: React.Dispatch<React.SetStateAction<RestriccionesForm[]>>;
  fetchRestricciones: () => Promise<void>;
  getRestriccionesByProyecto: (proyectoId: string, clienteId?: string) => RestriccionesForm[];
  
}

const AppContext = createContext<AppContextProps | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [clienteId, setClienteId] = useState<string | null>(null);
  console.log("contextclienteID",clienteId)
  const [proyectoId, setProyectoId] = useState<string | null>(null);
  console.log("contextProyectID",proyectoId)
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [proyectos, setProyectos] = useState<Proyecto[]>([]);
  const [equipoData, setEquipoData] = useState<Personal[]>([]);
  const [restricciones, setRestricciones] = useState<RestriccionesForm[]>([]);
  

  // Función para obtener restricciones desde el backend
  const fetchRestricciones = async () => {
    try {
      const response = await API.get('/restricciones/');
      console.log('Restricciones cargadas:', response.data.data);
      setRestricciones(response.data.data);
    } catch (error) {
      console.error('Error al cargar las restricciones:', error);
    }
  };

  // Función para filtrar restricciones por proyectoId (y opcionalmente clienteId)
  const getRestriccionesByProyecto = (proyectoId: string, clienteId?: string): RestriccionesForm[] => {
    return restricciones.filter((restriccion) => {
      const matchProyecto = restriccion.proyecto?.toString().trim() === proyectoId.trim();
      const matchCliente = clienteId ? restriccion.cliente?.toString().trim() === clienteId.trim() : true;
  
      console.log("Comparando restricción:", restriccion);
      console.log("matchProyecto:", matchProyecto, "matchCliente:", matchCliente);
  
      return matchProyecto && matchCliente;
    });
  };
  

  useEffect(() => {
    const fetchClientes = async () => {
      try {
        const response = await API.get('/clientes/');
        console.log('Clientes obtenidos:', response.data.data);
        setClientes(response.data.data);
      } catch (error) {
        console.error('Error al obtener los clientes:', error);
      }
    };

    const fetchProyectos = async () => {
      try {
        const response = await API.get('/proyectos/');
        setProyectos(response.data.data);
      } catch (error) {
        console.error('Error al obtener los proyectos:', error);
      }
    };

    const fetchEquipo = async () => {
      try {
        const response = await API.get('/equipo/');
        setEquipoData(response.data.data);
      } catch (error) {
        console.error('Error al obtener los datos del equipo:', error);
      }
    };

    fetchClientes();
    fetchProyectos();
    fetchEquipo();
    fetchRestricciones(); // Cargar restricciones
  }, []);

  return (
    <AppContext.Provider
      value={{
        clientes,
        setClientes,
        proyectos,
        setProyectos,
        equipoData,
        setEquipoData,
        restricciones,
        setRestricciones,
        fetchRestricciones,
        getRestriccionesByProyecto,
        clienteId,
        setClienteId,
        proyectoId,
        setProyectoId,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

// Hook para usar el contexto
export const useAppContext = (): AppContextProps => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext debe usarse dentro de un AppProvider');
  }
  return context;
};
