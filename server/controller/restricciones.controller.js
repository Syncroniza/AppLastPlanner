import { Types, Error } from "mongoose";
const { ObjectId } = Types;
import { RestriccionesModel } from "../models/restricciones.models.js";
import {ClienteModel} from "../models/cliente.models.js"
import {ProyectoModel}from "../models/proyecto.models.js"

export function getAllRestriciones(req, res) {
  const { proyectoId, clienteId } = req.query; // Obtener proyectoId y clienteId de los query params

  const filter = {};
  if (proyectoId && ObjectId.isValid(proyectoId)) {
    filter.proyecto = proyectoId;
  }
  if (clienteId && ObjectId.isValid(clienteId)) {
    filter.cliente = clienteId;
  }

  RestriccionesModel.find(filter)
    .then((data) => {
      console.log("Datos obtenidos:", data);
      if (data.length === 0) {
        return res.status(404).json({ message: "No se encontraron restricciones" });
      }
      res.json({ data });
    })
    .catch((error) => {
      console.error("Error al obtener las restricciones:", error);
      res.status(500).json({ error: error.message || error });
    });
}


export function getOneRestricciones(req, res) {
  const proyectoId = req.params.proyectoId;
  if (!ObjectId.isValid(proyectoId)) {
    return res.status(400).json({ message: "El ID del proyecto no es válido" });
  }

  RestriccionesModel.find({ proyecto: proyectoId })
    .populate('proyecto') // Población del proyecto
    .populate('cliente')  // Población del cliente
    .then((data) => {
      if (data.length === 0) {
        return res.status(404).json({ message: "No se encontraron restricciones para este proyecto" });
      }
      res.json({ data });
    })
    .catch((error) => {
      console.error("Error al obtener restricciones por proyecto:", error);
      res.status(500).json({ error: error.message || error });
    });
}


export async function createRestricciones(req, res) {
  try {
    const { clienteId, proyectoId, ...rest } = req.body;

    // Logs de depuración para verificar los IDs recibidos
    console.log("Cliente ID recibido:", clienteId);
    console.log("Proyecto ID recibido:", proyectoId);

    // Verifica si el cliente existe
    const cliente = await ClienteModel.findById(clienteId);
    if (!cliente) {
      console.log("Cliente no encontrado con ID:", clienteId); // Log de depuración
      return res.status(404).json({ message: "Cliente no encontrado" });
    }
    console.log("Cliente encontrado:", cliente); // Log de depuración

    // Verifica si el proyecto existe
    const proyecto = await ProyectoModel.findById(proyectoId);
    if (!proyecto) {
      console.log("Proyecto no encontrado con ID:", proyectoId); // Log de depuración
      return res.status(404).json({ message: "Proyecto no encontrado" });
    }
    console.log("Proyecto encontrado:", proyecto); // Log de depuración

    // Verifica si el proyecto pertenece al cliente (opcional)
    if (!proyecto.clienteId.equals(cliente._id)) {
      console.log(`El proyecto con ID ${proyectoId} no pertenece al cliente con ID ${clienteId}`); // Log de depuración
      return res.status(400).json({ message: "El proyecto no pertenece al cliente proporcionado" });
    }

    // Encuentra el último documento y genera un nuevo ID basado en él
    const lastRestriccion = await RestriccionesModel.findOne().sort({ id_restriccion: -1 }).exec();
    const newNumber = lastRestriccion
      ? parseInt(lastRestriccion.id_restriccion.split("-")[1], 10) + 1
      : 101;
    const newId = `R-${newNumber}`;

    // Crea la nueva restricción con referencia a cliente y proyecto
    const nuevaRestriccion = new RestriccionesModel({
      id_restriccion: newId,
      cliente: clienteId,
      proyecto: proyectoId,
      ...rest,
    });

    const savedRestriccion = await nuevaRestriccion.save();
    console.log("Restricción creada con éxito:", savedRestriccion); // Log de depuración
    res.status(201).json({ data: savedRestriccion });
  } catch (error) {
    console.error("Error al crear la restricción:", error);
    res.status(500).json({ error: "Error al crear la restricción" });
  }
}

export function deleteRestricciones(req, res) {
  let id = req.params.id;
  if (!ObjectId.isValid(id))
    return res.status(400).json({ message: "Id  do not match" });
  RestriccionesModel.deleteOne({ _id: id })
    .then(() => {
      res.json({ success: true });
    })
    .catch((error) => {
      res.status(500).json({ error: error });
    });
}
export function editRestricciones(req, res) {
  console.log("Received update request for task ID:", req.params.id);
  console.log("Request body:", req.body);

  let id = req.params.id;
  let data = req.body;

  const updateOptions = {
    new: true, // Devuelve el documento actualizado
    runValidators: true, // Ejecuta las validaciones al actualizar
  };

  if (!ObjectId.isValid(id)) {
    return res.status(400).json({ message: "Id do not match" });
  }

  // Actualiza todos los campos pasados en el cuerpo de la solicitud
  RestriccionesModel.findByIdAndUpdate(id, data, updateOptions)
    .then((updatedDocument) => {
      if (!updatedDocument) {
        return res.status(404).json({ message: "Restricción no encontrada" });
      }
      res.json({ success: true, restriccion: updatedDocument });
    })
    .catch((error) => {
      console.error("Error al actualizar la restricción:", error);
      if (error.name === "ValidationError") {
        let keys = Object.keys(error.errors);
        let error_dict = {};
        keys.forEach((key) => {
          error_dict[key] = error.errors[key].message;
        });
        res.status(400).json({ error: error_dict });
      } else {
        res.status(500).json({ error: error.message || error });
      }
    });
}
