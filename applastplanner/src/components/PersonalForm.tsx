import React, { useState, useEffect } from "react";
import { useAppContext } from "../components/Context";
import API from "../api";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

interface TeamMember {
  nombre: string;
  apellido: string;
  empresa: string;
  correo: string;
  cargo: string;
  cliente: string;
  proyecto: string;
}

const FormularioEquipo: React.FC = () => {
  const {
    clienteId,
    setClienteId,
    proyectoId,
    setProyectoId,
    clientes,
    proyectos,
    setEquipoData,
  } = useAppContext();
  const [loading, setLoading] = useState(false);
  const initialFormState: TeamMember = {
    nombre: "",
    apellido: "",
    empresa: "",
    correo: "",
    cargo: "",
    cliente: clienteId || "",
    proyecto: proyectoId || "",
  };
  const [formData, setFormData] = useState<TeamMember>(initialFormState);

  useEffect(() => {
    // Sincronizar el clienteId y proyectoId con el estado del formulario
    setFormData((prev) => ({
      ...prev,
      cliente: clienteId || "",
      proyecto: proyectoId || "",
    }));
  }, [clienteId, proyectoId]);

  const handleChange = (
    e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>
  ) => {
    const { name, value } = e.target;

    if (name === "cliente") {
      setClienteId(value);
    } else if (name === "proyecto") {
      setProyectoId(value);
    }

    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await API.post("/equipo", formData);
      console.log("Equipo agregado:", response.data);

      // Actualizar el estado del equipo
      setEquipoData((prev) => [...prev, response.data]);

      // Mostrar notificación de éxito
      toast.success("¡Usuario creado con éxito!", {
        position: "top-center",
        autoClose: 5000,
      });
       // Limpiar el formulario
       setFormData(initialFormState);
    } catch (error) {
      console.error("Error al agregar el equipo:", error);

      // Mostrar notificación de error
      toast.error("Error al crear el usuario. Por favor, intente nuevamente.", {
        position: "top-center",
        autoClose: 5000,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <form
        onSubmit={handleSubmit}
        className="flex flex-wrap gap-4 bg-gray-100 rounded-lg mt-2 p-6"
      >
        <div className="flex-1">
          <label htmlFor="nombre" className="block font-medium mb-1 text-xs">
            Nombre:
          </label>
          <input
            type="text"
            id="nombre"
            name="nombre"
            value={formData.nombre}
            onChange={handleChange}
            required
            className="w-full border p-2 rounded ml-2 text-xs"
          />
        </div>
        <div className="flex-1">
          <label htmlFor="apellido" className="block font-medium mb-1 text-xs">
            Apellido:
          </label>
          <input
            type="text"
            id="apellido"
            name="apellido"
            value={formData.apellido}
            onChange={handleChange}
            required
            className="w-full border p-2 rounded text-xs"
          />
        </div>
        <div className="flex-1 text-xs">
          <label htmlFor="empresa" className="block font-medium mb-1">
            Empresa:
          </label>
          <input
            type="text"
            id="empresa"
            name="empresa"
            value={formData.empresa}
            onChange={handleChange}
            required
            className="w-full border p-2 rounded text-xs"
          />
        </div>
        <div className="flex-1">
          <label htmlFor="correo" className="block font-medium mb-1 text-xs">
            Correo:
          </label>
          <input
            type="email"
            id="correo"
            name="correo"
            value={formData.correo}
            onChange={handleChange}
            required
            className="w-full border p-2 rounded text-xs"
          />
        </div>
        <div className="flex-1">
          <label htmlFor="cargo" className="block font-medium mb-1 text-xs">
            Cargo:
          </label>
          <input
            type="text"
            id="cargo"
            name="cargo"
            value={formData.cargo}
            onChange={handleChange}
            required
            className="w-full border p-2 rounded text-xs"
          />
        </div>
        <div className="flex-1 text-xs">
          <label htmlFor="cliente" className="block font-medium mb-1 text-xs">
            Cliente:
          </label>
          <select
            id="cliente"
            name="cliente"
            value={formData.cliente}
            onChange={handleChange}
            required
            className="w-full border p-2 rounded text-xs"
          >
            <option value="">Seleccione un cliente</option>
            {clientes.map((cliente) => (
              <option key={cliente._id} value={cliente._id}>
                {cliente.nombre}
              </option>
            ))}
          </select>
        </div>
        <div className="flex-1 mr-2 text-xs">
          <label htmlFor="proyecto" className="block font-medium mb-1 mr-2">
            Proyecto:
          </label>
          <select
            id="proyecto"
            name="proyecto"
            value={formData.proyecto}
            onChange={handleChange}
            required
            className="w-full border p-2 rounded mr-2 text-xs"
          >
            <option value="">Seleccione un proyecto</option>
            {proyectos.map((proyecto) => (
              <option key={proyecto._id} value={proyecto._id}>
                {proyecto.nombre}
              </option>
            ))}
          </select>
        </div>
        <div className="w-full mt-4 p-2 text-xs">
          <button
            type="submit"
            className={`bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600 w-full  text-xs${
              loading ? "opacity-50 cursor-not-allowed" : ""
            }`}
            disabled={loading}
          >
            {loading ? (
              <div className="flex justify-center items-center">
                <svg
                  className="animate-spin h-5 w-5 mr-3 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8v8H4z"
                  ></path>
                </svg>
                Guardando...
              </div>
            ) : (
              "Guardar"
            )}
          </button>
        </div>
      </form>

      {/* Contenedor de react-toastify */}
      <ToastContainer />
    </>
  );
};

export default FormularioEquipo;
