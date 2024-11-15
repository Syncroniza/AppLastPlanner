import { ClienteModel } from "../models/cliente.models.js";


export async function getAllClientes(req, res) {
  try {
    const clientes = await ClienteModel.find({}).populate('proyectos'); // Asegúrate de que 'proyectos' esté bien referenciado
    res.status(200).json({ data: clientes });
  } catch (error) {
    console.error("Error al obtener los clientes:", error);
    res.status(500).json({ error: error.message || "Error al obtener los clientes" });
  }
}


export async function getClienteById(req, res) {
  try {
    const cliente = await ClienteModel.findById(req.params.id);
    if (!cliente) {
      return res.status(404).json({ message: "Cliente no encontrado" });
    }
    res.status(200).json({ data: cliente });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

export async function createCliente(req, res) {
  try {
    const nuevoCliente = new ClienteModel(req.body);
    const clienteGuardado = await nuevoCliente.save();
    res.status(201).json({ data: clienteGuardado });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

export async function updateCliente(req, res) {
  try {
    const clienteActualizado = await ClienteModel.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!clienteActualizado) {
      return res.status(404).json({ message: "Cliente no encontrado" });
    }
    res.status(200).json({ data: clienteActualizado });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

export async function deleteCliente(req, res) {
  try {
    const clienteEliminado = await ClienteModel.findByIdAndDelete(req.params.id);
    if (!clienteEliminado) {
      return res.status(404).json({ message: "Cliente no encontrado" });
    }
    res.status(200).json({ message: "Cliente eliminado" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
