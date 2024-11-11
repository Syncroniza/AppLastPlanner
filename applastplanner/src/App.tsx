import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Sidebar from './components/SideBar';
import Home from './pages/Home';
import Personal from './pages/Personal';
import Restricciones from './pages/Restricciones';
import PPC from './pages/PPC';
import Estadisticas from './pages/Estadisticas';
import ClienteProyectoList from './components/ClienteProyectoList';
import { AppProvider } from './components/Context';

const App: React.FC = () => {
  return (
    <AppProvider>
      <Router>
        <div className="flex">
          <Sidebar />
          <div className="flex-grow p-4">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/personal" element={<Personal />} />
              <Route path="/restricciones" element={<Restricciones />} />
              <Route path="/ppc" element={<PPC />} />
              <Route path="/estadisticas" element={<Estadisticas />} />
              <Route path="/clientes-proyectos" element={<ClienteProyectoList />} />
              <Route path="/proyectos/:proyectoId/restricciones" element={<Restricciones />} />
              <Route path="/proyectos/:proyectoId/personal" element={<Personal />} />
            </Routes>
          </div>
        </div>
      </Router>
    </AppProvider>
  );
};

export default App;
