import mongoose from "mongoose";

const RestriccionesSchema = new mongoose.Schema(
  {
    
    responsable: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "crew", // Referencia al modelo Equipo
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
      enum: ["abierta", "cerrada"], // Solo permite estos dos estados
      required: true,
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
    fechaCierre: {
      type: Date, // Fecha automática cuando se marca como cerrada
    },
    aliases: [
      {
        type: String,
      },
    ],
    proyecto: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Proyecto", // Referencia a un proyecto
      required: true,
    },
    cliente: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Cliente", // Referencia a un cliente
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

export const RestriccionesModel = mongoose.model(
  "Restriccion",
  RestriccionesSchema
);

