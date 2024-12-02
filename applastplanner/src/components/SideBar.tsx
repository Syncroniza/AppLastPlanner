import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAppContext } from "../components/Context"

const Sidebar: React.FC = () => {
  const { logout } = useAppContext();

  const [isOpen, setIsOpen] = useState(false);

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
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
          <h2 className="text-2xl font-bold mb-4">Menu</h2>
          <ul>
            <li className="mb-2">
              <Link to="/home" className="block p-2 hover:bg-gray-700 rounded">
                Home
              </Link>
            </li>
            <li className="mb-2">
              <Link to="/clientes-proyectos" className="block p-2 hover:bg-gray-700 rounded">
                Clientes/Proyectos
              </Link>
            </li>
            <li className="mb-2">
              <Link to="/personal" className="block p-2 hover:bg-gray-700 rounded">
                Personal
              </Link>
            </li>
            {/* <li className="mb-2">
              <Link to="/restricciones" className="block p-2 hover:bg-gray-700 rounded">
                Restricciones
              </Link>
            </li> */}
            <li className="mb-2">
              <Link to="/ppc" className="block p-2 hover:bg-gray-700 rounded">
                PPC
              </Link>
            </li>
          </ul>
          <div className="sidebar">
      {/* Otros enlaces y opciones del Sidebar */}
      <div className="mt-24">
        <button
          onClick={logout}
          className="w-full bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded"
        >
          Logout
        </button>
      </div>
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
        {/* Icono de menú */}
        ☰
      </button>
     
    </div>
  );
};

export default Sidebar;
