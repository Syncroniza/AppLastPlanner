import mongoose, { Schema } from "mongoose";

const HormigonSchema = new Schema(
  {
    clienteId: {
      type: Schema.Types.ObjectId,
      ref: "Cliente",
      required: true,
    },
    proyectoId: {
      type: Schema.Types.ObjectId,
      ref: "Proyecto",
      required: true,
    },
    item: {
      type: Number,
      required: true,
    },
    guia: {
      type: String,
      required: true,
    },
    empresaProveedoresHG: {
      type: String,
      required: true,
    },
    fecha: {
      type: Date,
      required: true,
    },
    piso: {
      type: String,
      required: true,
    },
    ubicacion: {
      type: String,
      required: true,
    },
    elemento: {
      type: String,
      required: true,
    },
    cantidad: {
      type: Number,
      required: true,
    },
    cantidadAcumulada: {
      type: Number,
      required: true,
    },
    muestras: {
      type: String,
      required: true,
    },
    tipo: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true, // Agrega createdAt y updatedAt automáticamente
  }
);

export const HormigonModel = mongoose.model("Hormigon", HormigonSchema);