import React, { useState } from 'react';
import axios from 'axios';
import { RestriccionesForm } from '../types/Restricciones';
import { useAppContext } from '../components/Context';

const FormularioRestricciones: React.FC = () => {
  const { equipoData } = useAppContext();

  const [formData, setFormData] = useState<RestriccionesForm>({
    id_restriccion: '', // El ID se mostrará aquí después de la creación
    responsable: '',
    compromiso: '',
    centrocosto: '',
    fechacreacion: '',
    fechacompromiso: '',
    status: '',
    observaciones: '',
    cnc: '',
    nuevafecha: '',
    aliases: [''],
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const dataToSend = {
        ...formData,
        fechacreacion: new Date(formData.fechacreacion),
        fechacompromiso: new Date(formData.fechacompromiso),
        nuevafecha: new Date(formData.nuevafecha),
      };

      const response = await axios.post('http://localhost:8000/restricciones/', dataToSend);
      console.log('Datos enviados correctamente:', response.data);

      if (response.status === 201 || response.status === 200) {
        // Verifica si `data` es un array y obtiene el último elemento
        const createdId = response.data.data?.[response.data.data.length - 1]?.id_restriccion || '';

        if (createdId) {
          console.log('ID creado:', createdId);
          // Actualiza formData para mostrar el ID generado
          setFormData({
            id_restriccion: createdId, // Muestra el ID creado en el formulario
            responsable: '',
            compromiso: '',
            centrocosto: '',
            fechacreacion: '',
            fechacompromiso: '',
            status: '',
            observaciones: '',
            cnc: '',
            nuevafecha: '',
            aliases: [''],
          });
        } else {
          console.warn('No se encontró un ID en la respuesta.');
        }
      }
    } catch (error) {
      console.error('Error al enviar los datos:', error);
    }
  };

  return (
    <div>
      <h1 className="text-3xl font-bold mb-4">INGRESO NUEVAS RESTRICCIONES </h1>
      <form onSubmit={handleSubmit} className="flex flex-wrap items-center gap-4 p-4 bg-gray-100 shadow-md w-full">
        {/* Mostrar el ID de la restricción en un campo de solo lectura */}
        {formData.id_restriccion && (
          <div className="flex flex-col w-full sm:w-1/2 md:w-1/3 lg:w-1/4">
            <label className="text-xs font-semibold">ID de Restricción</label>
            <input
              type="text"
              name="id_restriccion"
              value={formData.id_restriccion}
              readOnly
              className="border border-gray-300 rounded-md p-1 text-sm bg-gray-200 cursor-not-allowed"
            />
          </div>
        )}

        {/* Campo de selección de responsable */}
        <div className="flex flex-col w-full sm:w-1/2 md:w-1/3 lg:w-1/4">
          <label className="text-xs font-semibold">Responsable</label>
          <select
            name="responsable"
            value={formData.responsable}
            onChange={handleChange}
            className="border border-gray-300 rounded-md p-1 text-sm"
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
        {[
          { label: 'Compromiso', name: 'compromiso' },
          { label: 'Centro de Costo', name: 'centrocosto' },
          { label: 'Fecha Creación', name: 'fechacreacion', type: 'date' },
          { label: 'Fecha Compromiso', name: 'fechacompromiso', type: 'date' },
          { label: 'Status', name: 'status' },
          { label: 'CNC', name: 'cnc' },
          { label: 'Nueva Fecha', name: 'nuevafecha', type: 'date' },
        ].map((field) => (
          <div key={field.name} className="flex flex-col w-full sm:w-1/2 md:w-1/3 lg:w-1/4">
            <label className="text-xs font-semibold">{field.label}</label>
            <input
              type={field.type || 'text'}
              name={field.name}
              value={(formData as any)[field.name]}
              onChange={handleChange}
              className="border border-gray-300 rounded-md p-1 text-sm"
            />
          </div>
        ))}

        <button
          type="submit"
          className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 w-full sm:w-auto"
        >
          Enviar
        </button>
      </form>

      {/* Mostrar el ID creado si existe */}
      {formData.id_restriccion && (
        <div className="mt-4">
          <p className="text-green-600 font-semibold">
            Restricción creada con ID: {formData.id_restriccion}
          </p>
        </div>
      )}
    </div>
  );
};

export default FormularioRestricciones;