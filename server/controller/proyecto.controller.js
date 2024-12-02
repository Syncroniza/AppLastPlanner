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
    const { clienteId, ...rest } = req.body; // Extraer clienteId del cuerpo

    // Verifica si el cliente existe
    const cliente = await ClienteModel.findById(clienteId);
    if (!cliente) {
      return res.status(404).json({ message: "Cliente no encontrado" });
    }

    // Crear el nuevo proyecto con el cliente asignado
    const nuevoProyecto = new ProyectoModel({
      cliente: clienteId, // Cliente se asigna aquí directamente
      ...rest,
    });

    const proyectoGuardado = await nuevoProyecto.save();

    // Agregar el proyecto al array de proyectos del cliente
    cliente.proyectos.push(proyectoGuardado._id);
    await cliente.save();

    res.status(201).json({ data: proyectoGuardado });
  } catch (error) {
    console.error("Error al crear el proyecto:", error);
    res.status(500).json({ error: "Error al crear el proyecto" });
  }
}




export async function updateProyecto(req, res) {
  try {
    const { cliente, ...rest } = req.body;

    // Verificar si se quiere actualizar el cliente
    if (cliente) {
      const clienteExistente = await ClienteModel.findById(cliente);
      if (!clienteExistente) {
        return res.status(404).json({ error: "Cliente no encontrado." });
      }
    }

    const proyectoActualizado = await ProyectoModel.findByIdAndUpdate(
      req.params.id,
      { cliente, ...rest },
      { new: true, runValidators: true }
    ).populate("cliente");

    if (!proyectoActualizado) {
      return res.status(404).json({ message: "Proyecto no encontrado" });
    }

    res.status(200).json({ data: proyectoActualizado });
  } catch (error) {
    console.error("Error al actualizar el proyecto:", error);
    res.status(500).json({ error: "Error al actualizar el proyecto" });
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
