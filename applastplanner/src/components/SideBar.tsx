import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAppContext } from "../components/Context";
import { HiOutlineTrendingUp, HiOutlineClipboardCheck } from 'react-icons/hi';

const Sidebar: React.FC = () => {
  const { logout, setClienteId, setProyectoId, fetchRestricciones, clienteId, proyectoId } = useAppContext();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);

  // Estados para AVANCE
  const [isAvanceOpen, setIsAvanceOpen] = useState(false);
  const [isObraGruesaOpen, setIsObraGruesaOpen] = useState(false);
  const [isTerminacionesOpen, setIsTerminacionesOpen] = useState(false);

  // Estado para LAST PLANNER
  const [isLastPlannerOpen, setIsLastPlannerOpen] = useState(false);

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  const handleSidebarClick = async (cid: string, pid: string) => {
    setClienteId(cid);
    setProyectoId(pid);
    try {
      await fetchRestricciones(pid, cid);
      navigate(`/clientes-proyectos`);
    } catch (error) {
      console.error('Error al cargar restricciones desde el Sidebar:', error);
    }
  };

  return (
    <div className="flex">
      {/* Sidebar */}
      <div
        className={`fixed top-0 left-0 h-full w-64 bg-gray-800 text-white transform ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        } transition-transform duration-300 md:translate-x-0 md:relative md:w-64 z-50`}
      >
        <div className="p-4">
          <h2 className="text-2xl font-bold mb-4">Menú</h2>
          <ul>
            {/* HOME */}
            <li className="mb-2">
              <Link to="/home" className="flex items-center p-2 hover:bg-gray-700 rounded">
                Home
              </Link>
            </li>

            {/* AVANCE */}
            <li className="mb-2">
              <button
                onClick={() => setIsAvanceOpen(!isAvanceOpen)}
                className="flex items-center p-2 hover:bg-gray-700 rounded w-full text-left"
              >
                <HiOutlineTrendingUp className="mr-2" /> AVANCE
              </button>
              {isAvanceOpen && (
                <ul className="ml-4">
                  {/* OBRA GRUESA */}
                  <li className="mb-2">
                    <button
                      onClick={() => {
                        setIsObraGruesaOpen(!isObraGruesaOpen);
                        setIsTerminacionesOpen(false);
                      }}
                      className="block p-2 hover:bg-gray-700 rounded w-full text-left"
                    >
                      OBRA GRUESA
                    </button>
                    {isObraGruesaOpen && (
                      <ul className="ml-4">
                        <li className="mb-2">
                          <Link
                            to={proyectoId ? `/proyectos/${proyectoId}/obragruesa/hormigon` : '#'}
                            className={`block p-2 hover:bg-gray-700 rounded ${
                              !proyectoId ? 'opacity-50 cursor-not-allowed' : ''
                            }`}
                          >
                            Hormigón
                          </Link>
                        </li>
                        <li className="mb-2">
                          <Link
                            to={proyectoId ? `/proyectos/${proyectoId}/obragruesa/curvahormigon` : '#'}
                            className={`block p-2 hover:bg-gray-700 rounded ${
                              !proyectoId ? 'opacity-50 cursor-not-allowed' : ''
                            }`}
                          >
                            Curva de Hormigón
                          </Link>
                        </li>
                        <li className="mb-2">
                          <Link
                            to={proyectoId ? `/proyectos/${proyectoId}/obragruesa/registrohormigon` : '#'}
                            className={`block p-2 hover:bg-gray-700 rounded ${
                              !proyectoId ? 'opacity-50 cursor-not-allowed' : ''
                            }`}
                          >
                            Registro de Hormigón
                          </Link>
                        </li>
                      </ul>
                    )}
                  </li>

                  {/* TERMINACIONES */}
                  <li className="mb-2">
                    <button
                      onClick={() => {
                        setIsTerminacionesOpen(!isTerminacionesOpen);
                        setIsObraGruesaOpen(false);
                      }}
                      className="block p-2 hover:bg-gray-700 rounded w-full text-left"
                    >
                      TERMINACIONES
                    </button>
                    {isTerminacionesOpen && (
                      <ul className="ml-4">
                        <li className="mb-2">
                          <Link
                            to={proyectoId ? `/proyectos/${proyectoId}/terminaciones/curvasterminaciones` : '#'}
                            className={`block p-2 hover:bg-gray-700 rounded ${
                              !proyectoId ? 'opacity-50 cursor-not-allowed' : ''
                            }`}
                          >
                            Curvas de Terminaciones
                          </Link>
                        </li>
                      </ul>
                    )}
                  </li>
                </ul>
              )}
            </li>

            {/* LAST PLANNER */}
            <li className="mb-2">
              <button
                onClick={() => setIsLastPlannerOpen(!isLastPlannerOpen)}
                className="flex items-center p-2 hover:bg-gray-700 rounded w-full text-left"
              >
                <HiOutlineClipboardCheck className="mr-2" /> LAST PLANNER
              </button>
              {isLastPlannerOpen && (
                <ul className="ml-4">
                  <li className="mb-2">
                    <button
                      onClick={() => handleSidebarClick('cliente123', 'proyecto456')}
                      className="block p-2 hover:bg-gray-700 rounded w-full text-left"
                    >
                      Clientes/Proyectos
                    </button>
                  </li>
                  <li className="mb-2">
                    <Link to="/personal" className="block p-2 hover:bg-gray-700 rounded">
                      Personal
                    </Link>
                  </li>
                  <li className="mb-2">
                    <Link to="/ppc" className="block p-2 hover:bg-gray-700 rounded">
                      PPC
                    </Link>
                  </li>
                </ul>
              )}
            </li>
          </ul>
          <div className="sidebar mt-4">
            <button
              onClick={logout}
              className="w-full bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded"
            >
              Logout
            </button>
          </div>
        </div>
      </div>

      {/* Fondo oscuro cuando el sidebar está abierto en dispositivos pequeños */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black opacity-50 md:hidden z-40"
          onClick={toggleSidebar}
        ></div>
      )}

      {/* Botón de hamburguesa */}
      <button
        onClick={toggleSidebar}
        className="p-2 bg-blue-500 text-white rounded-md md:hidden fixed top-4 left-4 z-50"
      >
        ☰
      </button>
    </div>
  );
};

export default Sidebar;