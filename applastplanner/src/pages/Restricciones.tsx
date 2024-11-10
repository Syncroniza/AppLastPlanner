import React from 'react';
import FormularioRestricciones from '../components/FormularioRestricciones';
import ListadoRestricciones from '../components/ListadoRestricciones';


const Restricciones: React.FC = () => {
  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <FormularioRestricciones />
      <ListadoRestricciones />
    </div>
  );
};

export default Restricciones;
