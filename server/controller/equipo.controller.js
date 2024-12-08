import { Types, Error } from "mongoose";
const { ObjectId } = Types;
import { EquipoModel } from "../models/equipo.models.js";

export function getAllEquipo(req, res) {
  console.log("Solicitud recibida en /desglosegg/");
  EquipoModel
    .find({})
    .populate("proyecto") // Poblamos el campo `proyecto`
    .populate("cliente") // Poblamos el campo `cliente`
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



export function getOneEquipo(req, res) {
  let id = req.params.id;
  if (!ObjectId.isValid(id))
    return res
      .status(400)
      .json({ message: "id doesn't match the expected format" });
      EquipoModel
    .findOne({ _id: id })
    .then((data) => {
      res.json({ data: data });
    })
    .catch((error) => {
      res.status(500).json({ error: error });
    });
}
export function createEquipo(req, res) {
  let data = req.body;
  console.log(data);
  EquipoModel
    .create(data)
    .then((createdEquipo) => {
      // Realizar populate de las referencias
      return EquipoModel.findById(createdEquipo._id)
        .populate('cliente') // Asegúrate de que el modelo `EquipoModel` tiene la referencia `cliente`
        .populate('proyecto'); // Asegúrate de que el modelo `EquipoModel` tiene la referencia `proyecto`
    })
    .then((populatedEquipo) => {
      res.json(populatedEquipo); // Devuelve el participante con cliente y proyecto completos
    })
    .catch((error) => {
      if (error.name === 'ValidationError') {
        const error_dict = Object.keys(error.errors).reduce((acc, key) => {
          acc[key] = error.errors[key].message;
          return acc;
        }, {});
        res.status(400).json({ error: error_dict });
      } else {
        res.status(500).json({ error: 'Error en el servidor', details: error });
      }
    });
}




export function deleteEquipo(req, res) {
  let id = req.params.id;
  if (!ObjectId.isValid(id))
    return res.status(400).json({ message: "Id  do not match" });
  EquipoModel
    .deleteOne({ _id: id })
    .then(() => {
      res.json({ success: true });
    })
    .catch((error) => {
      res.status(500).json({ error: error });
    });
}
export function editEquipo(req, res) {
  console.log("Received update request for task ID:", req.params.id); // Log the task ID
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

  // Asegúrate de que los campos 'subfamily' y 'familia' son correctos en tu base de datos
  EquipoModel
    .findByIdAndUpdate(
      id,
      { subfamily: data.subfamilia, familia: data.familia },
      updateOptions
    )
    .then((updatedDocument) => {
      if (!updatedDocument) {
        return res.status(404).json({ message: "APU not found" });
      }
      res.json({ success: true, apu: updatedDocument });
    })
    .catch((error) => {
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
