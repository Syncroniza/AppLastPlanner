import React from 'react';
import FormularioCliente from '../components/FormularioClientes';
import ProyectoForm from '../components/ProyectoForm';

const Home: React.FC = () => {
  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <FormularioCliente />
      <ProyectoForm />
    </div>
  );
};

export default Home;
