import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAppContext } from './Context';
import { RestriccionesForm } from '../types/Restricciones';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  restriccion: RestriccionesForm | null;
  onUpdate: (updatedRestriccion: RestriccionesForm) => void;
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, restriccion, onUpdate }) => {
  const { setRestricciones, equipoData } = useAppContext();
  const [formData, setFormData] = useState<RestriccionesForm | null>(null);

  useEffect(() => {
    if (restriccion) {
      setFormData(restriccion); // Inicializa el estado del formulario con la restricción seleccionada
    }
  }, [restriccion]);

  if (!isOpen || !formData) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await axios.patch(`http://localhost:8000/restricciones/${formData._id}/`, formData);
      if (response.status === 200) {
        // Actualiza el contexto global con la restricción modificada
        setRestricciones((prevRestricciones) =>
          prevRestricciones.map((restriccion) =>
            restriccion._id === formData._id ? formData : restriccion
          )
        );
        onUpdate(formData);
        onClose(); // Cierra el modal después de actualizar
      }
    } catch (error) {
      console.error('Error al actualizar la restricción:', error);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-6 rounded shadow-lg">
        <h2 className="text-lg font-semibold mb-4">Editar Restricción</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Dropdown para el campo de responsable cargado desde equipoData */}
          <div>
            <label className="text-sm font-medium">Responsable</label>
            <select
              name="responsable"
              value={formData.responsable}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded p-2"
            >
              <option value="">Seleccione un responsable</option>
              {equipoData.map((equipo) => (
                <option key={equipo.id} value={`${equipo.nombre} ${equipo.apellido}`}>
                  {equipo.nombre} {equipo.apellido}
                </option>
              ))}
            </select>
          </div>

          {/* Otros campos del formulario */}
          {['compromiso', 'centrocosto', 'cnc'].map((field) => (
            <div key={field}>
              <label className="text-sm font-medium capitalize">{field}</label>
              <input
                type="text"
                name={field}
                value={(formData as any)[field]}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded p-2"
              />
            </div>
          ))}
          {['fechacreacion', 'fechacompromiso', 'nuevafecha'].map((field) => (
            <div key={field}>
              <label className="text-sm font-medium capitalize">{field}</label>
              <input
                type="date"
                name={field}
                value={(formData as any)[field]?.split('T')[0] || ''}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded p-2"
              />
            </div>
          ))}

          {/* Dropdown para el campo de status */}
          <div>
            <label className="text-sm font-medium">Status</label>
            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded p-2"
            >
              <option value="abierta">Abierta</option>
              <option value="cerrada">Cerrada</option>
            </select>
          </div>

          <button type="submit" className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600">
            Guardar cambios
          </button>
          <button type="button" onClick={onClose} className="ml-2 bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600">
            Cancelar
          </button>
        </form>
      </div>
    </div>
  );
};

export default Modal;
