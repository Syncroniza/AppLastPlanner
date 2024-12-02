import { Types, Error } from "mongoose";
const { ObjectId } = Types;
import { RestriccionesModel } from "../models/restricciones.models.js";
import { ProyectoModel } from "../models/proyecto.models.js";

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
    .populate("responsable", "nombre apellido") // Poblar nombre y apellido del responsable
    .populate("cliente", "nombre") // Poblar nombre del cliente
    .populate("proyecto", "nombre") // Poblar nombre del proyecto
    .then((data) => {
      console.log("Datos obtenidos con población:", data);
      if (data.length === 0) {
        return res
          .status(404)
          .json({ message: "No se encontraron restricciones" });
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
    .populate("Proyecto") // Población del proyecto
    .populate("Cliente") // Población del cliente
    .then((data) => {
      if (data.length === 0) {
        return res.status(404).json({
          message: "No se encontraron restricciones para este proyecto",
        });
      }
      res.json({ data });
    })
    .catch((error) => {
      console.error("Error al obtener restricciones por proyecto:", error);
      res.status(500).json({ error: error.message || error });
    });
}
export async function getRestriccionesByProyecto(req, res) {
  const { proyectoId } = req.params;
  try {
    const restricciones = await RestriccionesModel.find({
      proyecto: proyectoId,
    });
    res.status(200).json({ data: restricciones });
  } catch (error) {
    console.error("Error al obtener restricciones:", error);
    res.status(500).json({ error: "Error al obtener restricciones" });
  }
}



export async function createRestricciones(req, res) {
  try {
    const { cliente, proyecto, responsable, ...rest } = req.body;

    console.log("Datos recibidos en la solicitud:", req.body);

    // Validar IDs
    if (!ObjectId.isValid(cliente)) {
      console.error("Cliente ID no válido:", cliente);
      return res.status(400).json({ message: `Cliente ID no válido: ${cliente}` });
    }

    if (!ObjectId.isValid(proyecto)) {
      console.error("Proyecto ID no válido:", proyecto);
      return res.status(400).json({ message: `Proyecto ID no válido: ${proyecto}` });
    }

    if (!ObjectId.isValid(responsable)) {
      console.error("Responsable ID no válido:", responsable);
      return res.status(400).json({ message: `Responsable ID no válido: ${responsable}` });
    }

    // Validar cliente y proyecto en una sola consulta
    const proyectoValido = await ProyectoModel.findOne({ _id: proyecto, cliente });
    if (!proyectoValido) {
      return res.status(400).json({ message: "El proyecto no pertenece al cliente proporcionado o no existe" });
    }

    // Validar campos adicionales
    const camposPermitidos = [
      "compromiso",
      "centrocosto",
      "fechacreacion",
      "fechacompromiso",
      "status",
      "observaciones",
      "cnc",
      "nuevafecha",
      "aliases",
    ];
    Object.keys(rest).forEach((key) => {
      if (!camposPermitidos.includes(key)) {
        console.warn(`Campo no permitido detectado: ${key}`);
        delete rest[key];
      }
    });

    // Crear nueva restricción
    const nuevaRestriccion = new RestriccionesModel({
      cliente,
      proyecto,
      responsable,
      ...rest,
    });

    const savedRestriccion = await nuevaRestriccion.save();
    console.log("Restricción creada con éxito:", savedRestriccion);
    res.status(201).json({ data: savedRestriccion });
  } catch (error) {
    console.error("Error al crear la restricción:", error);
    res.status(500).json({ error: error.message });
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
  console.log("Received update request for restriction ID:", req.params.id);
  console.log("Request body:", req.body);

  const id = req.params.id;
  let data = req.body;

  const updateOptions = {
    new: true, // Devuelve el documento actualizado
    runValidators: true, // Ejecuta las validaciones al actualizar
  };

  if (!ObjectId.isValid(id)) {
    return res.status(400).json({ message: "ID no válido" });
  }

  // Verificar si el status cambia a "cerrada" para asignar la fecha de cierre automáticamente
  if (data.status === "cerrada") {
    data.fechaCierre = new Date(); // Asignar la fecha actual como fecha de cierre
  } else if (data.status === "abierta") {
    data.fechaCierre = null; // Si se reabre, eliminar la fecha de cierre
  }

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
        const keys = Object.keys(error.errors);
        const errorDict = {};
        keys.forEach((key) => {
          errorDict[key] = error.errors[key].message;
        });
        res.status(400).json({ error: errorDict });
      } else {
        res.status(500).json({ error: error.message || error });
      }
    });
}
