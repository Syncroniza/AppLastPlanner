import { ProyectoModel } from "../models/proyecto.models.js";
import { ClienteModel } from "../models/cliente.models.js";

export async function getAllProyectos(req, res) {
  try {
    const proyectos = await ProyectoModel.find().populate("cliente");
    res.status(200).json({ data: proyectos });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

export const getProyectoById = async (req, res) => {
  try {
    const proyecto = await ProyectoModel.findById(req.params.id).populate("cliente");
    if (!proyecto) {
      return res.status(404).json({ error: "Proyecto no encontrado" });
    }
    res.status(200).json(proyecto);
  } catch (error) {
    console.error("Error al obtener el proyecto:", error);
    res.status(500).json({ error: "Error al obtener el proyecto" });
  }
};



export async function createProyecto(req, res) {
  try {
    const nuevoProyecto = new ProyectoModel(req.body);
    const proyectoGuardado = await nuevoProyecto.save();

    // Actualiza el cliente para agregar la referencia al proyecto
    await ClienteModel.findByIdAndUpdate(
      proyectoGuardado.clienteId,
      { $push: { proyectos: proyectoGuardado._id } },
      { new: true }
    );

    res.status(201).json({ data: proyectoGuardado });
  } catch (error) {
    console.error("Error al crear el proyecto:", error);
    res.status(500).json({ error: "Error al crear el proyecto" });
  }
}
export async function updateProyecto(req, res) {
  try {
    const proyectoActualizado = await ProyectoModel.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    ).populate("cliente");
    if (!proyectoActualizado) {
      return res.status(404).json({ message: "Proyecto no encontrado" });
    }
    res.status(200).json({ data: proyectoActualizado });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

export async function deleteProyecto(req, res) {
  try {
    const proyectoEliminado = await ProyectoModel.findByIdAndDelete(
      req.params.id
    );
    if (!proyectoEliminado) {
      return res.status(404).json({ message: "Proyecto no encontrado" });
    }
    res.status(200).json({ message: "Proyecto eliminado" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
