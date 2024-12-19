import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate, Outlet } from 'react-router-dom';
import Sidebar from './components/SideBar';
import Home from './pages/Home';
import Personal from './pages/Personal';
import Restricciones from './pages/Restricciones';
import PPC from './pages/PPC';
import ClienteProyectos from './pages/ClientesProyectos';
import Login from './pages/Login';
import Register from './pages/Register';
import ProtectedRoute from './services/ProtectedRoute';
import { AppProvider } from './components/Context';
import Hormigon from './pages/Hormigon';
import CurvaHormigon from './pages/CurvaHormigon';
import RegistroHormigon from './pages/RegistroHormigon';
import { HormigonesProvider } from "./components/HormigonesContext";
import SeleccionarProyecto from './pages/SeleccionarProyecto'; // Importa tu nuevo componente
import Header from './components/Header';
import "react-toastify/dist/ReactToastify.css";


const App: React.FC = () => {
  return (
    <Router>
      <AppProvider>
        <Routes>
          {/* Redirección predeterminada siempre a login */}
          <Route path="/" element={<Navigate to="/login" />} />

          {/* Rutas públicas */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Ruta para seleccionar el proyecto luego de loguearse */}
          <Route
            path="/seleccionar-proyecto"
            element={
              <ProtectedRoute>
                <SeleccionarProyecto />
              </ProtectedRoute>
            }
          />
          {/* Rutas protegidas */}
          <Route
            path="/home"
            element={
              <ProtectedRoute>
                <div className="flex flex-col h-screen">
                  {/* Header en la parte superior derecha */}
                  <div className="flex justify-end bg-gray-800">
                    <Header />
                  </div>
                  {/* Contenido principal con Sidebar */}
                  <div className="flex flex-grow">
                    <Sidebar />
                    <Home />
                  </div>
                </div>
              </ProtectedRoute>
            }
          />
          <Route
            path="/personal"
            element={
              <ProtectedRoute>
                <div className="flex flex-col h-screen">
                  <div className="flex justify-end bg-gray-800">
                    <Header />
                  </div>
                  <div className="flex flex-grow">
                    <Sidebar />
                    <Personal />
                  </div>
                </div>
              </ProtectedRoute>
            }
          />
          <Route
            path="/restricciones"
            element={
              <ProtectedRoute>
                <div className="flex flex-col h-screen">
                  <div className="flex justify-end bg-gray-800">
                    <Header />
                  </div>
                  <div className="flex flex-grow">
                    <Sidebar />
                    <Restricciones />
                  </div>
                </div>
              </ProtectedRoute>
            }
          />
          <Route
            path="/ppc"
            element={
              <ProtectedRoute>
                <div className="flex flex-col h-screen">
                  <div className="flex justify-end bg-gray-800">
                    <Header />
                  </div>
                  <div className="flex flex-grow">
                    <Sidebar />
                    <PPC />
                  </div>
                </div>
              </ProtectedRoute>
            }
          />
          <Route
            path="/clientes-proyectos"
            element={
              <ProtectedRoute>
                <div className="flex flex-col h-screen">
                  <div className="flex justify-end bg-gray-800">
                    <Header />
                  </div>
                  <div className="flex flex-grow">
                    <Sidebar />
                    <ClienteProyectos />
                  </div>
                </div>
              </ProtectedRoute>
            }
          />

          {/* Ruta de restricciones filtradas por proyecto */}
          <Route
            path="/proyectos/:proyectoId/restricciones"
            element={
              <ProtectedRoute>
                <div className="flex flex-col h-screen">
                  <div className="flex justify-end bg-gray-800">
                    <Header />
                  </div>
                  <div className="flex flex-grow">
                    <Sidebar />
                    <Restricciones />
                  </div>
                </div>
              </ProtectedRoute>
            }
          />

          {/* Personal filtrado por proyecto */}
          <Route
            path="/proyectos/:proyectoId/personal"
            element={
              <ProtectedRoute>
                <div className="flex flex-col h-screen">
                  <div className="flex justify-end bg-gray-800">
                    <Header />
                  </div>
                  <div className="flex flex-grow">
                    <Sidebar />
                    <Personal />
                  </div>
                </div>
              </ProtectedRoute>
            }
          />

          {/* Rutas para OBRA GRUESA dentro de AVANCE con HormigonesProvider */}
          <Route
            path="/proyectos/:proyectoId/obragruesa"
            element={
              <ProtectedRoute>
                <div className="flex flex-col h-screen">
                  <div className="flex justify-end bg-gray-800">
                    <Header />
                  </div>
                  <div className="flex flex-grow">
                    <Sidebar />
                    <HormigonesProvider>
                      <Outlet />
                    </HormigonesProvider>
                  </div>
                </div>
              </ProtectedRoute>
            }
          >
            <Route path="hormigon" element={<Hormigon />} />
            <Route path="curvahormigon" element={<CurvaHormigon />} />
            <Route path="registrohormigon" element={<RegistroHormigon />} />
          </Route>
        </Routes>
      </AppProvider>
    </Router>
  );
};

export default App;