import React, { useState, useEffect } from "react";
import { RestriccionesForm } from "../types/Restricciones";
import { useAppContext } from "../components/Context";
import { useLocation } from "react-router-dom";
import { Personal } from "../types/Personal";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
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

  const [filteredPersonal, setFilteredPersonal] = useState<Personal[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false); // Estado del modal

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

    const selectedResponsable = filteredPersonal.find(
      (personal) => personal._id === formData.responsable
    );

    if (!selectedResponsable) {
      console.error("No se encontró el responsable seleccionado.");
      return;
    }

    const dataToSend = {
      ...formData,
      responsable: formData.responsable,
      cliente: clienteId,
      proyecto: proyectoId,
    };

    try {
      const response = await API.post("/restricciones/", dataToSend);

      if (response.status === 201 || response.status === 200) {
        const newRestriccion = {
          ...response.data.data,
          responsable: selectedResponsable,
        };
        setRestricciones((prev) => [...prev, newRestriccion]);

        // Mostrar notificación de éxito
        toast.success("Restricción creada con éxito 🎉", {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "colored",
        });

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
        setIsModalOpen(false); // Cierra el modal después de enviar
      }
    } catch (error) {
      console.error("Error al enviar los datos:", error);

      // Mostrar notificación de error
      toast.error("Error al crear la restricción. Intenta de nuevo.", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
      });
    }
  };

  const handleGuardarCambios = () => {
    if (proyectoId) {
      getRestriccionesByProyecto(proyectoId, clienteId);
    }
  };

  return (
    <div>
      <h1 className="font-bold mb-4 text-lg">
        Crear Restricción para {clienteNombre} - Proyecto: {proyectoNombre}
      </h1>
      {/* Botón para abrir el modal */}
      <button
        className="bg-green-500 text-sm text-white px-2 py-2 rounded hover:bg-green-600 "
        onClick={() => setIsModalOpen(true)}
      >
        Abrir Formulario
      </button>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded shadow-lg w-full max-w-lg">
            <h2 className="font-bold text-sm mb-4 ">Crear Restricción</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block font-semibold text-xs">Responsable</label>
                <select
                  name="responsable"
                  value={typeof formData.responsable === "string" ? formData.responsable : formData.responsable?._id || ""}
                  onChange={handleChange}
                  className="border border-gray-300 rounded w-full p-2 text-xs"
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
                <div key={field.name}>
                  <label className="block font-semibold text-xs">{field.label}</label>
                  <input
                    type={field.type || "text"}
                    name={field.name}
                    value={formData[field.name] || ""}
                    onChange={handleChange}
                    className="border border-gray-300 rounded w-full p-2 text-xs"
                  />
                </div>
              ))}
              <div className="flex justify-end space-x-4 text-xs">
                <button
                  type="button"
                  className="bg-gray-300 px-4 py-2 rounded text-xs"
                  onClick={() => setIsModalOpen(false)}
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="bg-green-400 text-white px-4  rounded text-sm"
                >
                  Enviar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Contenedor para las notificaciones */}
      <ToastContainer />
    </div>
  );
};

export default FormularioRestricciones;