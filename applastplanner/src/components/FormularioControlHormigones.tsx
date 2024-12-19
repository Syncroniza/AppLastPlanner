import React, { useState } from "react";
import { useHormigones } from "../components/HormigonesContext";
import { HormigonData } from "../types/Hormigon";
import API from "../api";
import { useAppContext } from "../components/Context";
import { ToastContainer, toast } from "react-toastify";


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
    const [isModalOpen, setIsModalOpen] = useState(false);

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

            // Mostrar mensaje de éxito
            toast.success("Registro ingresado con éxito 🎉", {
                position: "top-right",
                autoClose: 2000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "colored",
            });

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
            setIsModalOpen(false);
        } catch (error) {
            console.error("Error al guardar los datos:", error);
            toast.error("Ocurrió un error al guardar los datos. Por favor, inténtalo de nuevo.", {
                position: "top-right",
                autoClose: 2000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "colored",
            });
        }
    };

    return (
        <>
            <button
                onClick={() => setIsModalOpen(true)}
                className="px-4 py-2 text-white bg-blue-500 rounded hover:bg-blue-600"
            >
                Abrir Formulario
            </button>

            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-800 bg-opacity-50">
                    <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-2xl">
                        <h2 className="text-sm font-semibold text-gray-700 mb-4">Formulario de Hormigones</h2>
                        <form onSubmit={handleSubmit} className="space-y-4 text-sm">
                            <div className="grid grid-cols-2 gap-4">
                                <label className="flex flex-col text-xs">
                                    N° GUÍA
                                    <input
                                        type="text"
                                        name="guia"
                                        value={hormigonData.guia}
                                        onChange={handleChange}
                                        className="p-2 border rounded text-xs"
                                    />
                                </label>
                                <label className="flex flex-col text-xs">
                                    EMPRESA PROVEEDORA DE HORMIGÓN
                                    <select
                                        name="empresaProveedoresHG"
                                        value={hormigonData.empresaProveedoresHG}
                                        onChange={handleChange}
                                        className="p-2 border rounded text-xs text-gray-500"
                                    >
                                        <option value="">Selecciona una empresa</option>
                                        <option value="Santa Laura Hormigones">Santa Laura Hormigones</option>
                                        <option value="Transex">Transex</option>
                                        <option value="Redymix">Redymix</option>
                                    </select>
                                </label>
                                <label className="flex flex-col text-xs text-gray-500">
                                    FECHA
                                    <input
                                        type="date"
                                        name="fecha"
                                        value={hormigonData.fecha}
                                        onChange={handleChange}
                                        className="p-2 border rounded text-xs"
                                    />
                                </label>
                                <label className="flex flex-col text-xs text-gray-500">
                                    PISO
                                    <select
                                        name="piso"
                                        value={hormigonData.piso}
                                        onChange={handleChange}
                                        className="p-2 border rounded"
                                    >
                                        <option value="">Selecciona un piso</option>
                                        <option value="Pilas">Pilas</option>
                                        <option value="Fundaciones">Fundaciones</option>
                                        <option value="Radieres">Radieres</option>
                                        <option value="2Subt">2 Subt</option>
                                    </select>
                                </label>
                                <label className="flex flex-col text-xs">
                                    UBICACIÓN (EJES)
                                    <input
                                        type="text"
                                        name="ubicacion"
                                        value={hormigonData.ubicacion}
                                        onChange={handleChange}
                                        className="p-2 border rounded text-xs"
                                    />
                                </label>
                                <label className="flex flex-col text-xs">
                                    ELEMENTO
                                    <select
                                        name="elemento"
                                        value={hormigonData.elemento}
                                        onChange={handleChange}
                                        className="p-2 border rounded text-xs text-gray-400"
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
                                <label className="flex flex-col text-xs">
                                    CANTIDAD
                                    <input
                                        type="number"
                                        name="cantidad"
                                        value={String(hormigonData.cantidad)}
                                        onChange={handleChange}
                                        className="p-2 border rounded text-xs"
                                    />
                                </label>
                                <label className="flex flex-col text-xs">
                                    MUESTRAS
                                    <select
                                        name="muestras"
                                        value={hormigonData.muestras}
                                        onChange={handleChange}
                                        className="p-2 border rounded text-xs"
                                    >
                                        <option value="">Selecciona una opción</option>
                                        <option value="Sí">Sí</option>
                                        <option value="No">No</option>
                                    </select>
                                </label>
                                <label className="flex flex-col text-xs text-gray-500">
                                    TIPO HORMIGÓN
                                    <select
                                        name="tipo"
                                        value={hormigonData.tipo}
                                        onChange={handleChange}
                                        className="p-2 border rounded text-xs"
                                    >
                                        <option value="">Selecciona un tipo</option>
                                        <option value="HS 4,0 (00) 20/10">HS 4,0 (00) 20/10</option>
                                        <option value="GR 20,0 (10) 20/10">GR 20,0 (10) 20/10</option>
                                        <option value="GR 25,0 (10) 40/08">GR 25,0 (10) 40/08</option>
                                        <option value="GR 25,0(10)20/08BR07">GR 25,0(10)20/08BR07</option>
                                        <option value="GB 30,00(10)20/10">GB 30,00(10)20/10</option>
                                    </select>
                                </label>
                            </div>
                            <div className="flex justify-end space-x-2 text-xs">
                                <button
                                    type="button"
                                    onClick={() => setIsModalOpen(false)}
                                    className="px-4 py-2 text-white bg-red-500 rounded hover:bg-red-600 text-xs"
                                >
                                    Cancelar
                                </button>
                                <button
                                    type="submit"
                                    className="px-4 py-2 text-white bg-green-500 rounded hover:bg-green-600 text-xs"
                                >
                                    Guardar
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
            {/* Contenedor para las notificaciones */}
            <ToastContainer />
        </>
    );
};

export default FormularioControlHormigones;