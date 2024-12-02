import React, { useState, useEffect } from "react";
import { useAppContext } from "../components/Context";
import API from "../api";

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
    equipoData,
    setEquipoData,
  } = useAppContext();

  const [formData, setFormData] = useState<TeamMember>({
    nombre: "",
    apellido: "",
    empresa: "",
    correo: "",
    cargo: "",
    cliente: clienteId || "",
    proyecto: proyectoId || "",
  });

  useEffect(() => {
    // Sincronizar el clienteId y proyectoId del contexto con el estado del formulario
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
    try {
      const response = await API.post("/equipo", formData);
      console.log("Equipo agregado:", response.data);
      setEquipoData([...equipoData, response.data]);
    } catch (error) {
      console.error("Error al agregar el equipo:", error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-wrap gap-4 bg-gray-200 rounded-lg m-2">
      <div className="flex-1">
        <label htmlFor="nombre" className="block font-medium mb-1">
          Nombre:
        </label>
        <input
          type="text"
          id="nombre"
          name="nombre"
          value={formData.nombre}
          onChange={handleChange}
          required
          className="w-full border p-2 rounded ml-2"
        />
      </div>
      <div className="flex-1">
        <label htmlFor="apellido" className="block font-medium mb-1">
          Apellido:
        </label>
        <input
          type="text"
          id="apellido"
          name="apellido"
          value={formData.apellido}
          onChange={handleChange}
          required
          className="w-full border p-2 rounded"
        />
      </div>
      <div className="flex-1">
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
          className="w-full border p-2 rounded"
        />
      </div>
      <div className="flex-1">
        <label htmlFor="correo" className="block font-medium mb-1">
          Correo:
        </label>
        <input
          type="email"
          id="correo"
          name="correo"
          value={formData.correo}
          onChange={handleChange}
          required
          className="w-full border p-2 rounded"
        />
      </div>
      <div className="flex-1">
        <label htmlFor="cargo" className="block font-medium mb-1">
          Cargo:
        </label>
        <input
          type="text"
          id="cargo"
          name="cargo"
          value={formData.cargo}
          onChange={handleChange}
          required
          className="w-full border p-2 rounded"
        />
      </div>
      <div className="flex-1">
        <label htmlFor="cliente" className="block font-medium mb-1">
          Cliente:
        </label>
        <select
          id="cliente"
          name="cliente"
          value={formData.cliente}
          onChange={handleChange}
          required
          className="w-full border p-2 rounded"
        >
          <option value="">Seleccione un cliente</option>
          {clientes.map((cliente) => (
            <option key={cliente._id} value={cliente._id}>
              {cliente.nombre}
            </option>
          ))}
        </select>
      </div>
      <div className="flex-1 mr-2">
        <label htmlFor="proyecto" className="block font-medium mb-1 mr-2">
          Proyecto:
        </label>
        <select
          id="proyecto"
          name="proyecto"
          value={formData.proyecto}
          onChange={handleChange}
          required
          className="w-full border p-2 rounded mr-2 "
        >
          <option value="">Seleccione un proyecto</option>
          {proyectos.map((proyecto) => (
            <option key={proyecto._id} value={proyecto._id}>
              {proyecto.nombre}
            </option>
          ))}
        </select>
      </div>
      <div className="w-full mt-4">
        <button
          type="submit"
          className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 w-full"
        >
          Guardar
        </button>
      </div>
    </form>
  );
};

export default FormularioEquipo;
