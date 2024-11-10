import React from 'react';

const Estadisticas: React.FC = () => {
  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <h1 className="text-3xl font-bold mb-4">Bienvenido al Panel Principal</h1>
      <p className="text-gray-700">
        Esta es la página de inicio de tu aplicación. Aquí puedes ver un resumen general o acceder a diferentes módulos desde la barra lateral.
      </p>
      <div className="mt-6">
        <button className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
          Explorar más
        </button>
      </div>
    </div>
  );
};

export default Estadisticas;
