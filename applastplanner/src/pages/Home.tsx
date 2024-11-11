import React from 'react';
import FormularioCliente from '../components/FormularioClientes';
import ProyectoForm from '../components/ProyectoForm';
import ClienteProyectoList from '../components/ClienteProyectoList';

const Home: React.FC = () => {
  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <FormularioCliente />
      <ProyectoForm />
      <ClienteProyectoList />
    </div>
  );
};

export default Home;
