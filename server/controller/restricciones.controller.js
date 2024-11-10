import { Types, Error } from "mongoose";
const { ObjectId } = Types;
import { RestriccionesModel } from "../models/restricciones.models.js";

export function getAllRestriciones(req, res) {
  console.log("Solicitud recibida en /desglosegg/");
  RestriccionesModel.find({})
    .then((data) => {
      console.log("Datos obtenidos:", data);
      if (data.length === 0) {
        return res.status(404).json({ message: "No se encontraron datos" });
      }
      res.json({ data });
    })
    .catch((error) => {
      console.error("Error al obtener los datos:", error);
      res.status(500).json({ error: error.message || error });
    });
}

export function getOneRestricciores(req, res) {
  let id = req.params.id;
  if (!ObjectId.isValid(id))
    return res
      .status(400)
      .json({ message: "id doesn't match the expected format" });
  RestriccionesModel.findOne({ _id: id })
    .then((data) => {
      res.json({ data: data });
    })
    .catch((error) => {
      res.status(500).json({ error: error });
    });
}
export async function createRestricciones(req, res) {
  try {
    // Encuentra el último documento y genera un nuevo ID basado en él
    const lastRestriccion = await RestriccionesModel.findOne()
      .sort({ id_restriccion: -1 })
      .exec();
    const newNumber = lastRestriccion
      ? parseInt(lastRestriccion.id_restriccion.split("-")[1], 10) + 1
      : 101;
    const newId = `R-${newNumber}`;

    // Crea la nueva restricción
    const nuevaRestriccion = new RestriccionesModel({
      id_restriccion: newId,
      ...req.body,
    });

    const savedRestriccion = await nuevaRestriccion.save();
    res.status(201).json({ data: savedRestriccion }); // Devuelve la restricción con el ID creado
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
