import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { login } from '../services/authService';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false); // Estado para el mensaje de autenticación
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await login({ email, password });
      setIsAuthenticated(true); // Mostrar mensaje de éxito
      setTimeout(() => {
        navigate('/seleccionar-proyecto'); // Redirige después de 2 segundos
      }, 2000);
    } catch (err) {
      setError('Credenciales incorrectas');
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gradient-to-b from-blue-600 to-blue-200  relative">
      {/* Logo */}


      {/* Contenedor del formulario de inicio de sesión */}

      <div className="w-full max-w-md bg-white  p-6 rounded-lg">
        <div className="flex items-center justify-center py-4 ">
          <img
            src="/Syncroniza_transparente.png" // Ruta desde la carpeta public
            alt="Logo de la empresa"
            className="h-20 w-auto" // Ajusta la altura y el ancho
          />
        </div>
        <h1 className="text-3xl font-bold mb-4 text-center">Syncroniza Restricciones</h1>

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700">Correo electrónico</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border border-gray-300 rounded p-2"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Contraseña</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border border-gray-300 rounded p-2"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
          >
            Iniciar Sesión
          </button>
        </form>
        {error && <p className="text-red-500 mt-2">{error}</p>}
      </div>

      {/* Mensaje de éxito centrado */}
      {isAuthenticated && (
        <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-8 rounded-lg shadow-lg text-center">
            <h2 className="text-2xl font-bold text-green-600 mb-4">¡Autenticación Exitosa!</h2>
            <p className="text-gray-700">Redirigiendo al panel...</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Login;