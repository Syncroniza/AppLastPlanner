// App.tsx

import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
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

          {/* Rutas protegidas */}
          <Route
            path="/home"
            element={
              <ProtectedRoute>
                <div className="flex">
                  <Sidebar />
                  <Home />
                </div>
              </ProtectedRoute>
            }
          />
          <Route
            path="/personal"
            element={
              <ProtectedRoute>
                <div className="flex">
                  <Sidebar />
                  <Personal />
                </div>
              </ProtectedRoute>
            }
          />
          <Route
            path="/restricciones"
            element={
              <ProtectedRoute>
                <div className="flex">
                  <Sidebar />
                  <Restricciones />
                </div>
              </ProtectedRoute>
            }
          />
          <Route
            path="/ppc"
            element={
              <ProtectedRoute>
                <div className="flex">
                  <Sidebar />
                  <PPC />
                </div>
              </ProtectedRoute>
            }
          />
          <Route
            path="/clientes-proyectos"
            element={
              <ProtectedRoute>
                <div className="flex">
                  <Sidebar />
                  <ClienteProyectos />
                </div>
              </ProtectedRoute>
            }
          />
          <Route
            path="/proyectos/:proyectoId/restricciones"
            element={
              <ProtectedRoute>
                <div className="flex">
                  <Sidebar />
                  <Restricciones />
                </div>
              </ProtectedRoute>
            }
          />
          <Route
            path="/proyectos/:proyectoId/personal"
            element={
              <ProtectedRoute>
                <div className="flex">
                  <Sidebar />
                  <Personal />
                </div>
              </ProtectedRoute>
            }
          />
        </Routes>
      </AppProvider>
    </Router>
  );
};

export default App;
