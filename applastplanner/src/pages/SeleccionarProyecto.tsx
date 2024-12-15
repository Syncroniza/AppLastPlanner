import React, { useState, useEffect } from 'react';
import { useAppContext } from '../components/Context';
import { useNavigate } from 'react-router-dom';

const SeleccionarProyecto: React.FC = () => {
    const { proyectos, setClienteId, setProyectoId, fetchProyectos } = useAppContext();
    const [proyectoSeleccionado, setProyectoSeleccionado] = useState<string>('');
    const navigate = useNavigate();

    useEffect(() => {
        // Si no se han cargado los proyectos, puedes llamarlos aquí
        // o si ya se cargan en AppProvider no hace falta.
        fetchProyectos();
    }, [fetchProyectos]);

    const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setProyectoSeleccionado(e.target.value);
    };

    const handleConfirmar = () => {
        if (!proyectoSeleccionado) {
            alert('Por favor, selecciona un proyecto.');
            return;
        }

        // Encontrar el proyecto seleccionado
        const proyecto = proyectos.find(p => p._id === proyectoSeleccionado);
        if (!proyecto) {
            alert('Proyecto no encontrado.');
            return;
        }

        // Establecer proyectoId
        setProyectoId(proyecto._id);

        // Verificar tipo de cliente
        if (proyecto.cliente && typeof proyecto.cliente !== 'string') {
            setClienteId(proyecto.cliente._id);
        } else {
            setClienteId(null);
        }

        // Redirigir a home
        navigate('/home');
    };

    return (
        <div className="p-6 bg-white rounded shadow-md w-full max-w-sm mx-auto mt-20">
            <h1 className="text-2xl font-bold mb-4">Seleccionar Proyecto</h1>
            <div className="mb-4">
                <select
                    value={proyectoSeleccionado}
                    onChange={handleChange}
                    className="w-full p-2 border rounded"
                >
                    <option value="">-- Selecciona un proyecto --</option>
                    {proyectos.map((proyecto) => (
                        <option key={proyecto._id} value={proyecto._id}>
                            {proyecto.nombre}
                        </option>
                    ))}
                </select>
            </div>
            <button
                onClick={handleConfirmar}
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
                Confirmar
            </button>
        </div>
    );
};

export default SeleccionarProyecto;