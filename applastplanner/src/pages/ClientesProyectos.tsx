import React from 'react';
import ClienteProyectoList from '../components/ClienteProyectoList';

const ClienteProyectos: React.FC = () => {
  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
    <ClienteProyectoList />
    </div>
  );
};

export default ClienteProyectos;
