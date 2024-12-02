import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';
import { Personal } from '../types/Personal';
import { RestriccionesForm } from '../types/Restricciones';
import { Cliente } from '../types/Cliente';
import { Proyecto } from '../types/Proyecto';
import API from '../api';
import { useNavigate } from 'react-router-dom';

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
  logout: () => void;
  
}


const AppContext = createContext<AppContextProps | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [clienteId, setClienteId] = useState<string | null>(null);
  console.log("contextclienteID",clienteId)
  const [proyectoId, setProyectoId] = useState<string | null>(null);
  console.log("contextProyectID",proyectoId)
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [proyectos, setProyectos] = useState<Proyecto[]>([]);
  console.log("proyectoscontext",proyectos)
  const [equipoData, setEquipoData] = useState<Personal[]>([]);
  console.log("equipoData",equipoData)
  const [restricciones, setRestricciones] = useState<RestriccionesForm[]>([]);
  console.log("restricciones",restricciones)

  // Inicializar navigate para redireccionar
  const navigate = useNavigate();
  

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

  // Función para cerrar sesión
  const logout = () => {
    setClienteId(null);
    setProyectoId(null);
    setClientes([]);
    setProyectos([]);
    setEquipoData([]);
    setRestricciones([]);
    localStorage.removeItem('authToken'); // Limpiar token de autenticación si se usa uno
    navigate('/login'); // Redirigir al login
  };

  // Función para filtrar restricciones por proyectoId (y opcionalmente clienteId)
  const getRestriccionesByProyecto = (proyectoId: string, clienteId?: string): RestriccionesForm[] => {
    return restricciones.filter((restriccion) => {
      // Verificar si `proyecto` es un string o un objeto, y asegurarse de que no sea `null`
      const matchProyecto =
        restriccion.proyecto &&
        ((typeof restriccion.proyecto === 'string' && restriccion.proyecto.trim() === proyectoId.trim()) ||
          (typeof restriccion.proyecto === 'object' && restriccion.proyecto._id?.toString().trim() === proyectoId.trim()));
  
      // Verificar si `cliente` es un string o un objeto, y asegurarse de que no sea `null`
      const matchCliente = clienteId
        ? restriccion.cliente &&
          ((typeof restriccion.cliente === 'string' && restriccion.cliente.trim() === clienteId.trim()) ||
            (typeof restriccion.cliente === 'object' && restriccion.cliente._id?.toString().trim() === clienteId.trim()))
        : true;
  
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
        console.log("resoonseprojectos",response)
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
        logout,
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
