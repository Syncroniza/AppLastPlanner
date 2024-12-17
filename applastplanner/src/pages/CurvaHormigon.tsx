import React from 'react';
import CurvaHormigonChart from '../components/CurvaHormigonChart';
import CurvaHormigonList from '../components/CurvaHormigonList';

function CurvaHormigon() {
  return (
    <div style={containerStyle}>
      <div style={chartContainerStyle}>
       
        <div>
          <CurvaHormigonList />
          <CurvaHormigonChart />
        </div>
      </div>
    </div>
  );
}

// Estilos definidos como constantes
const containerStyle: React.CSSProperties = {
  width: '100vw',
  height: '100vh',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  padding: '10px',
  boxSizing: 'border-box', // Literal válido para evitar errores
};

const chartContainerStyle: React.CSSProperties = {
  width: '100%',
  height: '100%',
  maxWidth: '1200px',
  aspectRatio: '16 / 9', // Sintaxis válida para relación de aspecto
};

export default CurvaHormigon;