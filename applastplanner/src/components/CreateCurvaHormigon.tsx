// src/components/CreateCurvaHormigon.tsx

import { useForm, SubmitHandler } from 'react-hook-form';
import { useAppContext } from './Context'; // Asegúrate de que el hook esté correctamente exportado
import { useHormigones } from './HormigonesContext';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';
import API from '../api';

interface FormData {
  inicio: string; // Fecha en formato YYYY-MM-DD
  fin: string;    // Fecha en formato YYYY-MM-DD
  Hg_Planificado: number;
}

const CreateCurvaHormigon: React.FC = () => {
  // Obtener clienteId y proyectoId desde AppContext
  const { clienteId, proyectoId } = useAppContext();

  // Obtener fetchCurvaHormigones desde HormigonesContext
  const { fetchCurvaHormigones } = useHormigones();

  // Definir el esquema de validación con Yup
  const validationSchema = Yup.object().shape({
    inicio: Yup.string()
      .required('La fecha de inicio es requerida')
      .matches(/^\d{4}-\d{2}-\d{2}$/, 'Formato de fecha inválido (YYYY-MM-DD)'),
    fin: Yup.string()
      .required('La fecha de fin es requerida')
      .matches(/^\d{4}-\d{2}-\d{2}$/, 'Formato de fecha inválido (YYYY-MM-DD)')
      .test('is-after', 'La fecha de fin debe ser posterior a la fecha de inicio', function(value) {
        const { inicio } = this.parent;
        if (!inicio || !value) return false;
        return new Date(value) > new Date(inicio);
      }),
    Hg_Planificado: Yup.number()
      .typeError('Hg Planificado debe ser un número')
      .required('Hg Planificado es requerido')
      .positive('Debe ser un número positivo')
      .integer('Debe ser un número entero'),
  });

  // Inicializar React Hook Form
  const { register, handleSubmit, reset, formState: { errors } } = useForm<FormData>({
    resolver: yupResolver(validationSchema),
  });

  // Manejar el envío del formulario
  const onSubmit: SubmitHandler<FormData> = async (data) => {
    if (!clienteId || !proyectoId) {
      alert('Debe seleccionar un cliente y un proyecto antes de crear una Curva de Hormigón.');
      return;
    }

    try {
      // Crear el objeto de Curva de Hormigón incluyendo clienteId y proyectoId
      const nuevaCurva = {
        ...data,
        cliente: clienteId,
        proyecto: proyectoId,
      };

      // Enviar los datos al backend
      await API.post('/curvahormigon/', nuevaCurva);

      alert('Curva de Hormigón creada exitosamente');

      // Resetear el formulario
      reset();

      // Refrescar la lista de Curvas de Hormigón
      fetchCurvaHormigones();
    } catch (error: any) {
      console.error('Error al crear Curva de Hormigón:', error);
      // Manejo de errores más detallado según la respuesta del backend
      if (error.response && error.response.data && error.response.data.message) {
        alert(`Error: ${error.response.data.message}`);
      } else {
        alert('Error al crear la Curva de Hormigón');
      }
    }
  };

  // Opcional: Deshabilitar el formulario si no hay clienteId o proyectoId
  const isFormDisabled = !clienteId || !proyectoId;

  return (
    <form onSubmit={handleSubmit(onSubmit)} style={formStyle}>
      <h2>Crear Curva de Hormigón</h2>

      {isFormDisabled && (
        <p style={{ color: 'red' }}>
          Debe seleccionar un cliente y un proyecto antes de crear una Curva de Hormigón.
        </p>
      )}

      <div style={inputGroupStyle}>
        <label htmlFor="inicio">Inicio:</label>
        <input
          type="date"
          id="inicio"
          {...register('inicio')}
          disabled={isFormDisabled}
        />
        {errors.inicio && <p style={errorStyle}>{errors.inicio.message}</p>}
      </div>

      <div style={inputGroupStyle}>
        <label htmlFor="fin">Fin:</label>
        <input
          type="date"
          id="fin"
          {...register('fin')}
          disabled={isFormDisabled}
        />
        {errors.fin && <p style={errorStyle}>{errors.fin.message}</p>}
      </div>

      <div style={inputGroupStyle}>
        <label htmlFor="Hg_Planificado">Hg Planificado (kg):</label>
        <input
          type="number"
          id="Hg_Planificado"
          {...register('Hg_Planificado')}
          disabled={isFormDisabled}
        />
        {errors.Hg_Planificado && <p style={errorStyle}>{errors.Hg_Planificado.message}</p>}
      </div>

      <button type="submit" style={buttonStyle} disabled={isFormDisabled}>
        Crear Curva de Hormigón
      </button>
    </form>
  );
};

// Estilos simples para el formulario (puedes personalizarlos o usar una librería de estilos)
const formStyle: React.CSSProperties = {
  maxWidth: '500px',
  margin: '20px auto',
  padding: '20px',
  border: '1px solid #ccc',
  borderRadius: '5px',
  backgroundColor: '#f9f9f9',
};

const inputGroupStyle: React.CSSProperties = {
  marginBottom: '15px',
  display: 'flex',
  flexDirection: 'column',
};

const errorStyle: React.CSSProperties = {
  color: 'red',
  fontSize: '0.9em',
  marginTop: '5px',
};

const buttonStyle: React.CSSProperties = {
  padding: '10px 15px',
  backgroundColor: '#28a745',
  color: '#fff',
  border: 'none',
  borderRadius: '3px',
  cursor: 'pointer',
};

export default CreateCurvaHormigon;