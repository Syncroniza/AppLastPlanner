import React from "react";
import { useAppContext } from "./Context";

const Header: React.FC = () => {
    const {
        proyectoId,
        proyectos,
    } = useAppContext();

    // Buscar el nombre del cliente y proyecto según sus IDs

    const proyectoNombre = proyectos.find((proyecto) => proyecto._id === proyectoId)?.nombre || "Proyecto no seleccionado";

    return (
        <header className="bg-blue-600 text-white p-4 shadow-md z-0">
            <div className="container mx-auto flex justify-between items-center">
                <div>
                    <p>Proyecto: <span className="font-semibold">{proyectoNombre}</span></p>
                </div>
            </div>
        </header>
    );
};

export default Header;