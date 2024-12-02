import React, { useEffect, useState } from "react";
import PersonalForm from "../components/PersonalForm";
import { useAppContext } from "../components/Context";
import API from "../api"; // Importa el cliente Axios configurado

const PersonalTable: React.FC = () => {
  const { equipoData, setEquipoData } = useAppContext();

  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await API.get("/equipo/");
        console.log("Datos obtenidos del servidor:", response.data);
        setEquipoData(response.data.data);
      } catch (error: any) {
        console.error("Error al obtener datos:", error);
        setError(error.response?.data?.message || "No se pudieron obtener los datos");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [setEquipoData]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="p-4">
      <h1 className="text-3xl font-bold mb-4">LISTADO DE PERSONAL</h1>
      <PersonalForm />

      {equipoData.length === 0 ? (
        <p className="text-gray-500 mt-4">No hay datos de personal disponibles.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full border border-gray-200 divide-y divide-gray-200 mt-4">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-4 py-2 text-center text-sm border-b border-gray-300">ID</th>
                <th className="px-4 py-2 text-center text-sm border-b border-gray-300">Nombre</th>
                <th className="px-4 py-2 text-center text-sm border-b border-gray-300">Apellido</th>
                <th className="px-4 py-2 text-center text-sm border-b border-gray-300">
                  Empresa Subcontratista
                </th>
                <th className="px-4 py-2 text-center text-sm border-b border-gray-300">Correo</th>
                <th className="px-4 py-2 text-center text-sm border-b border-gray-300">Cargo</th>
                <th className="px-4 py-2 text-center text-sm border-b border-gray-300">Cliente</th>
                <th className="px-4 py-2 text-center text-sm border-b border-gray-300">Proyecto</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {equipoData.map((personal, index) => (
                <tr key={personal.id || index} className="hover:bg-gray-50">
                  <td className="px-4 py-2 text-center text-sm border-r border-gray-300 whitespace-nowrap">
                    {index + 1}
                  </td>
                  <td className="px-4 py-2 text-center text-sm border-r border-gray-300 whitespace-nowrap">
                    {personal.nombre}
                  </td>
                  <td className="px-4 py-2 text-center text-sm border-r border-gray-300 whitespace-nowrap">
                    {personal.apellido}
                  </td>
                  <td className="px-4 py-2 text-center text-sm border-r border-gray-300 whitespace-nowrap">
                    {personal.empresa}
                  </td>
                  <td className="px-4 py-2 text-center text-sm border-r border-gray-300 whitespace-nowrap">
                    {personal.correo}
                  </td>
                  <td className="px-4 py-2 text-center text-sm border-r border-gray-300 whitespace-nowrap">
                    {personal.cargo}
                  </td>
                  <td className="px-4 py-2 text-center text-sm border-r border-gray-300 whitespace-nowrap">
                    {personal.cliente ? personal.cliente.nombre : "Sin cliente"}
                  </td>
                  <td className="px-4 py-2 text-center text-sm whitespace-nowrap">
                    {personal.proyecto ? personal.proyecto.nombre : "Sin proyecto"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default PersonalTable;
