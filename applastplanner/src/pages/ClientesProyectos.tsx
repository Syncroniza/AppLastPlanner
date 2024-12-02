import React from 'react';
import ClienteProyectoList from '../components/ClienteProyectoList';

const ClienteProyectos: React.FC = () => {
  return (
    <div className="w-full min-h-screen p-6 bg-gray-50 rounded-lg shadow-md">
    <ClienteProyectoList />
    </div>
  );
};

export default ClienteProyectos;
