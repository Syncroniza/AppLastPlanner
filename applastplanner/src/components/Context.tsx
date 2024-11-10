import React, { createContext, useState, useContext, ReactNode } from 'react';
import { Personal } from '../types/Personal'; // Asegúrate de importar la interfaz correctamente
import { RestriccionesForm } from '../types/Restricciones'; // Importa la interfaz de Restricciones

interface AppContextProps {
  equipoData: Personal[]; 
  setEquipoData: React.Dispatch<React.SetStateAction<Personal[]>>;
  restricciones: RestriccionesForm[];
  setRestricciones: React.Dispatch<React.SetStateAction<RestriccionesForm[]>>;
}

const AppContext = createContext<AppContextProps | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [equipoData, setEquipoData] = useState<Personal[]>([]);
  const [restricciones, setRestricciones] = useState<RestriccionesForm[]>([]); // Agrega estado para restricciones

  return (
    <AppContext.Provider value={{ equipoData, setEquipoData, restricciones, setRestricciones }}>
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
