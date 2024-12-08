import React from 'react';
import FormularioCliente from '../components/FormularioClientes';
import ProyectoForm from '../components/ProyectoForm';

const Home: React.FC = () => {
  return (
    <div className="p-6 bg-white rounded-lg shadow-md w-full">
      <FormularioCliente />
      <ProyectoForm />
    </div>
  );
};

export default Home;
