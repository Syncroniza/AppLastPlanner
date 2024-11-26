import mongoose from "mongoose";

const RestriccionesSchema = new mongoose.Schema(
  {
    id_restriccion: {
      type: String,
    },
    responsable: {
      type: String,
    },
    compromiso: {
      type: String,
    },
    centrocosto: {
      type: String,
    },
    fechacreacion: {
      type: Date,
    },
    fechacompromiso: {
      type: Date,
    },
    status: {
      type: String,
    },
    observaciones: {
      type: String,
    },
    cnc: {
      type: String,
    },
    nuevafecha: {
      type: Date,
    },
    aliases: [
      {
        type: String,
      },
    ],
    proyecto: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "proyecto", // Referencia a un proyecto
      required: true,
    },
    cliente: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "cliente", // Referencia a un cliente
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

export const RestriccionesModel = mongoose.model(
  "restricciones",
  RestriccionesSchema
);
