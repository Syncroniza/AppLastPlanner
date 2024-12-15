// controllers/curvahormigon.controller.js

import { CurvaHormigon } from "../models/curvahormigon.models.js";

// Obtener todos los registros de curva de hormigón
export const getAllCurvaHormigones = async (req, res) => {
  console.log(req.query)
  try {
    console.log("Parámetros de consulta recibidos:", req.query); 
    const { clienteId, proyectoId } = req.query;
    const query = {};
    if (clienteId) {
      query.cliente = clienteId;
    }
    if (proyectoId) {
      query.proyecto = proyectoId;
    }
    const curvaHormigones = await CurvaHormigon.find(query).populate('cliente proyecto');
    res.json(curvaHormigones);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// Obtener un registro específico de curva de hormigón por ID
export const getCurvaHormigonById = async (req, res) => {
  try {
    const { id } = req.params;
    const curvaHormigon = await CurvaHormigon.findById(id).populate('cliente proyecto');
    if (!curvaHormigon) {
      return res.status(404).json({ message: 'Curva de hormigón no encontrada' });
    }
    res.json(curvaHormigon);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Crear un nuevo registro de curva de hormigón
export const createCurvaHormigon = async (req, res) => {
  try {
    const { inicio, fin, Hg_Planificado, cliente, proyecto } = req.body;
    const nuevaCurva = new CurvaHormigon({ inicio, fin, Hg_Planificado, cliente, proyecto });
    await nuevaCurva.save();
    res.status(201).json(nuevaCurva);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Actualizar un registro existente de curva de hormigón
export const updateCurvaHormigon = async (req, res) => {
  try {
    const { id } = req.params;
    const actualizaciones = req.body;
    const curvaHormigonActualizada = await CurvaHormigon.findByIdAndUpdate(id, actualizaciones, { new: true });
    if (!curvaHormigonActualizada) {
      return res.status(404).json({ message: 'Curva de hormigón no encontrada' });
    }
    res.json(curvaHormigonActualizada);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Eliminar un registro de curva de hormigón
export const deleteCurvaHormigon = async (req, res) => {
  try {
    const { id } = req.params;
    const curvaHormigonEliminada = await CurvaHormigon.findByIdAndDelete(id);
    if (!curvaHormigonEliminada) {
      return res.status(404).json({ message: 'Curva de hormigón no encontrada' });
    }
    res.json({ message: 'Curva de hormigón eliminada exitosamente' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};