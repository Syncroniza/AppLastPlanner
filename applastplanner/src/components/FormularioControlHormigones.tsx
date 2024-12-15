import React, { useState } from "react";
import { useHormigones } from "../components/HormigonesContext";
import { HormigonData } from "../types/Hormigon";
import API from "../api";
import { useAppContext } from "../components/Context";

const FormularioControlHormigones: React.FC = () => {
    const [hormigonData, setHormigonData] = useState<HormigonData>({
        item: 0,
        guia: "",
        empresaProveedoresHG: "",
        fecha: "",
        piso: "",
        ubicacion: "",
        elemento: "",
        cantidad: 0,
        cantidadAcumulada: 0,
        muestras: "No",
        tipo: "",
    });

    const { addHormigon } = useHormigones();
    const { clienteId, proyectoId } = useAppContext();

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
    ) => {
        const { name, value } = e.target;
        setHormigonData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const dataToSend = {
                ...hormigonData,
                clienteId,
                proyectoId,
            };

            const response = await API.post("/hormigones", dataToSend);
            addHormigon(response.data.data);

            console.log("Respuesta de la API:", response.data);
            alert("Datos guardados exitosamente");

            setHormigonData({
                item: 0,
                guia: "",
                empresaProveedoresHG: "",
                fecha: "",
                piso: "",
                ubicacion: "",
                elemento: "",
                cantidad: 0,
                cantidadAcumulada: 0,
                muestras: "No",
                tipo: "",
            });
        } catch (error) {
            console.error("Error al guardar los datos:", error);
            alert("Ocurrió un error al guardar los datos. Por favor, inténtalo de nuevo.");
        }
    };

    return (
        <form 
          onSubmit={handleSubmit} 
          className="p-4 space-y-3 bg-gray-100 rounded-md shadow-md text-sm"
        >
            <div className="grid grid-cols-2 gap-3">
                <label className="flex flex-col">
                    N° GUÍA
                    <input
                        type="text"
                        name="guia"
                        value={hormigonData.guia}
                        onChange={handleChange}
                        className="p-1 border rounded text-sm"
                    />
                </label>
                <label className="flex flex-col">
                    EMPRESA PROVEEDORA DE HORMIGÓN
                    <select
                        name="empresaProveedoresHG"
                        value={hormigonData.empresaProveedoresHG}
                        onChange={handleChange}
                        className="p-1 border rounded text-sm"
                    >
                        <option value="">Selecciona una empresa</option>
                        <option value="Santa Laura Hormigones">Santa Laura Hormigones</option>
                        <option value="Transex">Transex</option>
                        <option value="Redymix">Redymix</option>
                    </select>
                </label>
                <label className="flex flex-col">
                    FECHA
                    <input
                        type="date"
                        name="fecha"
                        value={hormigonData.fecha}
                        onChange={handleChange}
                        className="p-1 border rounded text-sm"
                    />
                </label>
                <label className="flex flex-col">
                    PISO
                    <select
                        name="piso"
                        value={hormigonData.piso}
                        onChange={handleChange}
                        className="p-1 border rounded text-sm"
                    >
                        <option value="">Selecciona un piso</option>
                        <option value="Pilas">Pilas</option>
                        <option value="Fundaciones">Fundaciones</option>
                        <option value="Radieres">Radieres</option>
                        <option value="2Subt">2 Subt</option>
                        {/* Agrega las demás opciones */}
                    </select>
                </label>
                <label className="flex flex-col">
                    UBICACIÓN (EJES)
                    <input
                        type="text"
                        name="ubicacion"
                        value={hormigonData.ubicacion}
                        onChange={handleChange}
                        className="p-1 border rounded text-sm"
                    />
                </label>
                <label className="flex flex-col">
                    ELEMENTO
                    <select
                        name="elemento"
                        value={hormigonData.elemento}
                        onChange={handleChange}
                        className="p-1 border rounded text-sm"
                    >
                        <option value="">Selecciona un elemento</option>
                        <option value="Pilas">Pilas</option>
                        <option value="Emplantillado">Emplantillado</option>
                        <option value="Fundaciones">Fundaciones</option>
                        <option value="Radieres">Radieres</option>
                        <option value="Muros Perimetrales">Muros Perimetrales</option>
                        <option value="Muros">Muros</option>
                        <option value="Vigas">Vigas</option>
                        <option value="Losas">Losas</option>
                    </select>
                </label>
                <label className="flex flex-col">
                    CANTIDAD
                    <input
                        type="number"
                        name="cantidad"
                        value={String(hormigonData.cantidad)}
                        onChange={handleChange}
                        className="p-1 border rounded text-sm"
                    />
                </label>
                <label className="flex flex-col">
                    MUESTRAS
                    <select
                        name="muestras"
                        value={hormigonData.muestras}
                        onChange={handleChange}
                        className="p-1 border rounded text-sm"
                    >
                        <option value="">Selecciona una opción</option>
                        <option value="Sí">Sí</option>
                        <option value="No">No</option>
                    </select>
                </label>
                <label className="flex flex-col">
                    TIPO HORMIGON
                    <select
                        name="tipo"
                        value={hormigonData.tipo}
                        onChange={handleChange}
                        className="p-1 border rounded text-sm"
                    >
                        <option value="">Selecciona un tipo</option>
                        <option value="HS 4,0 (00) 20/10">HS 4,0 (00) 20/10</option>
                        <option value="GR 20,0 (10) 20/10">GR 20,0 (10) 20/10</option>
                        <option value="GR 25,0 (10) 40/08">GR 25,0 (10) 40/08</option>
                        <option value="GR 25,0(10)20/08BR07">GR 25,0(10)20/08BR07</option>
                        <option value="GB 30,00(10)20/10n">GB 30,00(10)20/10n</option>
                        {/* Más opciones */}
                    </select>
                </label>
            </div>
            <button type="submit" className="px-3 py-1 text-white bg-blue-500 rounded text-sm hover:bg-blue-600">
                Guardar
            </button>
        </form>
    );
};

export default FormularioControlHormigones;