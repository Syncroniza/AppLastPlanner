import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';
import axios from 'axios';
import { Personal } from '../types/Personal';
import { RestriccionesForm } from '../types/Restricciones';
import { Cliente } from '../types/Cliente';
import { Proyecto } from '../types/Proyecto';
import {BASE_URL} from "../constants.ts";

interface AppContextProps {
  clientes: Cliente[];
  setClientes: React.Dispatch<React.SetStateAction<Cliente[]>>;
  proyectos: Proyecto[];
  setProyectos: React.Dispatch<React.SetStateAction<Proyecto[]>>;
  equipoData: Personal[];
  setEquipoData: React.Dispatch<React.SetStateAction<Personal[]>>;
  restricciones: RestriccionesForm[];
  setRestricciones: React.Dispatch<React.SetStateAction<RestriccionesForm[]>>;
}

const AppContext = createContext<AppContextProps | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [proyectos, setProyectos] = useState<Proyecto[]>([]);
  const [equipoData, setEquipoData] = useState<Personal[]>([]);
  const [restricciones, setRestricciones] = useState<RestriccionesForm[]>([]);

  useEffect(() => {
    const fetchClientes = async () => {
      try {
        const response = await axios.get(BASE_URL + '/clientes/');
        setClientes(response.data.data);
      } catch (error) {
        console.error('Error al obtener los clientes:', error);
      }
    };

    const fetchProyectos = async () => {
      try {
        const response = await axios.get(BASE_URL + '/proyectos/');
        setProyectos(response.data.data);
      } catch (error) {
        console.error('Error al obtener los proyectos:', error);
      }
    };

    const fetchEquipo = async () => {
      try {
        const response = await axios.get(BASE_URL + '/equipo/');
        setEquipoData(response.data.data);
      } catch (error) {
        console.error('Error al obtener los datos del equipo:', error);
      }
    };

    const fetchRestricciones = async () => {
      try {
        const response = await axios.get(BASE_URL + '/restricciones/');
        setRestricciones(response.data.data);
      } catch (error) {
        console.error('Error al obtener las restricciones:', error);
      }
    };

    // Llamadas a las funciones para cargar los datos al montar el contexto
    fetchClientes();
    fetchProyectos();
    fetchEquipo();
    fetchRestricciones();
  }, []);

  return (
    <AppContext.Provider value={{
      clientes,
      setClientes,
      proyectos,
      setProyectos,
      equipoData,
      setEquipoData,
      restricciones,
      setRestricciones
    }}>
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
