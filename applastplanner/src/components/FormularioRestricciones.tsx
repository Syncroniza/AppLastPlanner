import React, { useState, useEffect } from "react";
import { RestriccionesForm } from "../types/Restricciones";
import { useAppContext } from "../components/Context";
import { useLocation } from "react-router-dom";
import { Personal } from "../types/Personal";

import API from "../api";

const FormularioRestricciones: React.FC = () => {

  const location = useLocation();
  const { clienteId, proyectoId, clienteNombre, proyectoNombre } = location.state || {};
  const { equipoData, setRestricciones, getRestriccionesByProyecto } = useAppContext();

  const [formData, setFormData] = useState<RestriccionesForm>({
    responsable: "",
    compromiso: "",
    centrocosto: "",
    fechacreacion: "",
    fechacompromiso: "",
    status: "",
    observaciones: "",
    cnc: "",
    nuevafecha: "",
    aliases: [""],
    cliente: "",
    proyecto: "",
    createdAt: "",
    updatedAt: "",
  });

  // Filtrar personal basado en clienteId y proyectoId
  const [filteredPersonal, setFilteredPersonal] = useState<Personal[]>([]);

  useEffect(() => {
    if (clienteId && proyectoId) {
      const filtered = equipoData.filter(
        (equipo) =>
          equipo.cliente?._id === clienteId && equipo.proyecto?._id === proyectoId
      );
      setFilteredPersonal(filtered);
    }
  }, [equipoData, clienteId, proyectoId]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.responsable || !clienteId || !proyectoId) {
      console.error("Responsable, cliente o proyecto no definidos.");
      return;
    }

    // Busca el objeto completo del responsable
    const selectedResponsable = filteredPersonal.find(
      (personal) => personal._id === formData.responsable
    );

    if (!selectedResponsable) {
      console.error("No se encontró el responsable seleccionado.");
      return;
    }

    const dataToSend = {
      ...formData,
      responsable: formData.responsable, // Enviar solo el ID al backend
      cliente: clienteId,
      proyecto: proyectoId,
    };

    console.log("Datos a enviar:", dataToSend);

    try {
      const response = await API.post("/restricciones/", dataToSend);
      console.log("Datos enviados correctamente:", response.data);

      if (response.status === 201 || response.status === 200) {
        // Incluye el objeto completo del responsable en el contexto
        const newRestriccion = {
          ...response.data.data,
          responsable: selectedResponsable, // Asocia el objeto completo
        };

        setRestricciones((prev) => [...prev, newRestriccion]);

        setFormData({
          responsable: "",
          compromiso: "",
          centrocosto: "",
          fechacreacion: "",
          fechacompromiso: "",
          status: "",
          observaciones: "",
          cnc: "",
          nuevafecha: "",
          aliases: [""],
          cliente: "",
          proyecto: "",
          createdAt: "",
          updatedAt: "",
        });

        handleGuardarCambios();
      }
    } catch (error) {
      console.error("Error al enviar los datos:", error);
    }
  };


  const handleGuardarCambios = () => {
    if (proyectoId) {
      getRestriccionesByProyecto(proyectoId, clienteId);
    }
  };

  return (
    <div>
      <h1 className="text-3xl font-bold mb-4">
        Crear Restricción para {clienteNombre} - Proyecto: {proyectoNombre}
      </h1>

      <form
        onSubmit={handleSubmit}
        className="flex flex-wrap items-center gap-4 p-4 bg-gray-100 shadow-md w-full"
      >
        <div className="flex flex-col w-full sm:w-1/2 md:w-1/3 lg:w-1/4">
          <label className="text-xs font-semibold">Responsable</label>
          <select
            name="responsable"
            value={typeof formData.responsable === 'string' ? formData.responsable : formData.responsable?._id || ""}
            onChange={handleChange}
            className="border border-gray-300 rounded-md p-1 text-sm"
          >
            <option value="">Seleccione un responsable</option>
            {filteredPersonal.map((equipo) => (
              <option key={equipo._id} value={equipo._id}>
                {equipo.nombre} {equipo.apellido}
              </option>
            ))}
          </select>

        </div>

        {[
          { label: "Compromiso", name: "compromiso" },
          { label: "Centro de Costo", name: "centrocosto" },
          { label: "Fecha Creación", name: "fechacreacion", type: "date" },
          { label: "Fecha Compromiso", name: "fechacompromiso", type: "date" },
          { label: "Status", name: "status" },
          { label: "CNC", name: "cnc" },
          { label: "Nueva Fecha", name: "nuevafecha", type: "date" },
        ].map((field) => (
          <div key={field.name} className="flex flex-col w-full sm:w-1/2 md:w-1/3 lg:w-1/4">
            <label className="text-xs font-semibold">{field.label}</label>
            <input
              type={field.type || "text"}
              name={field.name}
              value={formData[field.name] || ""}
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

      {/* <button
        onClick={handleGuardarCambios}
        className="mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
      >
        Guardar Cambios
      </button> */}
    </div>
  );
};

export default FormularioRestricciones;
