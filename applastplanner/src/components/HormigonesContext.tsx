// src/context/HormigonesContext.tsx

import React, { createContext, useContext, useState, ReactNode, useCallback } from "react";
import API from "../api";

// Interfaces definidas anteriormente
export interface HormigonData {
    guia: string;
    empresaProveedoresHG: string;
    fecha: string;
    piso: string;
    ubicacion: string;
    elemento: string;
    cantidad: number;
    muestras: string;
    tipo: string;
}

export interface CurvaHormigonData {
    _id?: string;
    inicio: string; // Fecha en formato ISO
    fin: string;    // Fecha en formato ISO
    Hg_Planificado: number;
    cliente: string;  // ID del cliente
    proyecto: string; // ID del proyecto
    createdAt?: string;
    updatedAt?: string;
}

interface HormigonesContextProps {
    // Para Hormigones
    hormigones: HormigonData[];
    fetchHormigones: (
        clienteId?: string | null,
        proyectoId?: string | null,
        page?: number,
        limit?: number
    ) => Promise<{
        data: HormigonData[];
        currentPage: number;
        totalPages: number;
    }>;
    addHormigon: (nuevoHormigon: HormigonData) => void;

    // Para CurvaHormigon
    curvaHormigones: CurvaHormigonData[];
    fetchCurvaHormigones: (
        clienteId?: string | null,
        proyectoId?: string | null
    ) => Promise<{ data: CurvaHormigonData[]; }>;
}

const HormigonesContext = createContext<HormigonesContextProps | undefined>(undefined);

export const HormigonesProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    // Estado para Hormigones
    const [hormigones, setHormigones] = useState<HormigonData[]>([]);
    console.log("hormigones",hormigones)

    // Funciones para Hormigones
    const fetchHormigones = useCallback(
        async (
            clienteId?: string | null,
            proyectoId?: string | null,
            page = 1,
            limit = 10
        ) => {
            const queryParams = new URLSearchParams();
            if (clienteId) queryParams.append("clienteId", clienteId);
            if (proyectoId) queryParams.append("proyectoId", proyectoId);
            queryParams.append("page", page.toString());
            queryParams.append("limit", limit.toString());

            const endpoint = `/hormigones?${queryParams.toString()}`;
            const response = await API.get(endpoint);
            console.log("response",response)

            const { data, currentPage, totalPages } = response.data;

            setHormigones(data);

            return {
                data,
                currentPage,
                totalPages,
            };
        },
        []
    );

    const addHormigon = (nuevoHormigon: HormigonData) => {
        setHormigones((prev) => [...prev, nuevoHormigon]);
    };

    // Estado para CurvaHormigon
    const [curvaHormigones, setCurvaHormigones] = useState<CurvaHormigonData[]>([]);
    console.log("curvaHormigones",curvaHormigones)

    // Función para fetch CurvaHormigon
    const fetchCurvaHormigones = useCallback(
        async (clienteId?: string | null, proyectoId?: string | null): Promise<{ data: CurvaHormigonData[] }> => {
            if (!clienteId || !proyectoId) {
                console.warn("fetchCurvaHormigones no se ejecuta debido a parámetros faltantes.");
                setCurvaHormigones([]); // Actualiza el estado con un arreglo vacío
                return { data: [] };
            }
    
            const queryParams = new URLSearchParams();
            queryParams.append("clienteId", clienteId);
            queryParams.append("proyectoId", proyectoId);
    
            const endpoint = `/curvahormigon?${queryParams.toString()}`;
            console.log("Endpoint generado:", endpoint);
    
            try {
                const response = await API.get<CurvaHormigonData[]>(endpoint);
                console.log("response curvahormigon", response.data);
    
                // Aquí pasamos directamente el arreglo al estado
                setCurvaHormigones(response.data);
    
                return { data: response.data };
            } catch (error) {
                console.error("Error al obtener curvas de hormigón:", error);
                setCurvaHormigones([]); // Manejo de errores: estado vacío
                return { data: [] };
            }
        },
        [setCurvaHormigones]
    );
    return (
        <HormigonesContext.Provider
            value={{
                hormigones,
                fetchHormigones,
                addHormigon,
                curvaHormigones,
                fetchCurvaHormigones,
            }}
        >
            {children}
        </HormigonesContext.Provider>
    );
};

export const useHormigones = (): HormigonesContextProps => {
    const context = useContext(HormigonesContext);
    if (!context) throw new Error("useHormigones debe usarse dentro de un HormigonesProvider");
    return context;
};