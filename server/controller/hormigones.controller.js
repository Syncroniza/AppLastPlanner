
import { HormigonModel } from "../models/hormigon.models.js";


// Obtener todos los registros de hormigones (filtrados opcionalmente por clienteId y proyectoId)
export const getAllHormigones = async (req, res) => {
  try {
    const { clienteId, proyectoId, page = 1, limit = 10 } = req.query;
    const query = {};

    if (clienteId) {
      query.clienteId = clienteId;
    }

    if (proyectoId) {
      query.proyectoId = proyectoId;
    }

    const pageNum = parseInt(page, 10) || 1;
    const limitNum = parseInt(limit, 10) || 10;
    const skip = (pageNum - 1) * limitNum;

    // Ejecuta las dos consultas en paralelo
    const [hormigones, total] = await Promise.all([
      HormigonModel.find(query).skip(skip).limit(limitNum),
      HormigonModel.countDocuments(query),
    ]);

    res.status(200).json({
      data: hormigones,
      currentPage: pageNum,
      totalPages: Math.ceil(total / limitNum),
      totalItems: total,
    });
  } catch (error) {
    console.error("Error al obtener los registros de hormigones:", error);
    res.status(500).json({ error: "Error al obtener los registros de hormigones" });
  }
};

// Obtener un registro de hormigón por ID
export const getHormigonById = async (req, res) => {
  try {
    const hormigon = await HormigonModel.findById(req.params.id);
    if (!hormigon) {
      return res.status(404).json({ error: "Hormigón no encontrado" });
    }
    res.status(200).json(hormigon);
  } catch (error) {
    console.error("Error al obtener el registro de hormigón:", error);
    res.status(500).json({ error: "Error al obtener el registro de hormigón" });
  }
};

// Crear un nuevo registro de hormigón
export const createHormigon = async (req, res) => {
  try {
    const nuevoHormigon = new HormigonModel(req.body);
    const hormigonGuardado = await nuevoHormigon.save();
    res.status(201).json({ data: hormigonGuardado });
  } catch (error) {
    console.error("Error al crear el registro de hormigón:", error);
    res.status(500).json({ error: "Error al crear el registro de hormigón" });
  }
};

// Actualizar un registro de hormigón por ID
export const updateHormigon = async (req, res) => {
  try {
    const hormigonActualizado = await HormigonModel.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!hormigonActualizado) {
      return res.status(404).json({ message: "Hormigón no encontrado" });
    }
    res.status(200).json({ data: hormigonActualizado });
  } catch (error) {
    console.error("Error al actualizar el registro de hormigón:", error);
    res.status(500).json({ error: "Error al actualizar el registro de hormigón" });
  }
};

// Eliminar un registro de hormigón por ID
export const deleteHormigon = async (req, res) => {
  try {
    const hormigonEliminado = await HormigonModel.findByIdAndDelete(req.params.id);
    if (!hormigonEliminado) {
      return res.status(404).json({ message: "Hormigón no encontrado" });
    }
    res.status(200).json({ message: "Registro de hormigón eliminado" });
  } catch (error) {
    console.error("Error al eliminar el registro de hormigón:", error);
    res.status(500).json({ error: "Error al eliminar el registro de hormigón" });
  }
};
