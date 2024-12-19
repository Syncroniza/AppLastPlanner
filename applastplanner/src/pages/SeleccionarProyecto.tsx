import React, { useState, useEffect } from 'react';
import { useAppContext } from '../components/Context';
import { useNavigate } from 'react-router-dom';
import BackgroundVideo from '../components/BackgroundVideo';

const SeleccionarProyecto: React.FC = () => {
    const { proyectos, setProyectoId, setClienteId, fetchProyectos } = useAppContext();
    const [proyectoSeleccionado, setProyectoSeleccionado] = useState<string>('');
    const navigate = useNavigate();

    useEffect(() => {
        fetchProyectos(); // Carga los proyectos al montar el componente
    }, [fetchProyectos]);

    const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setProyectoSeleccionado(e.target.value);
    };

    const handleConfirmar = () => {
        if (!proyectoSeleccionado) {
            alert('Por favor, selecciona un proyecto.');
            return;
        }

        // Encuentra el proyecto seleccionado
        const proyecto = proyectos.find((p) => p._id === proyectoSeleccionado);

        if (proyecto) {
            setProyectoId(proyecto._id); // Establece el proyectoId en el contexto
            if (proyecto.cliente && proyecto.cliente._id) {
                setClienteId(proyecto.cliente._id); // Establece el clienteId desde proyecto.cliente
            } else {
                console.error('El cliente asociado al proyecto no tiene un ID válido.');
            }
            navigate('/home'); // Redirige al home
        } else {
            alert('El proyecto seleccionado no es válido.');
        }
    };

    return (
        <div>
            <BackgroundVideo />
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
                                {proyecto.nombre} ({proyecto.cliente.nombre})
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
        </div>
    );
};

export default SeleccionarProyecto;