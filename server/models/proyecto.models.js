import mongoose from "mongoose";

const ProyectoSchema = new mongoose.Schema({
  nombre: {
    type: String,
    required: true,
  },
  descripcion: {
    type: String,
  },
  fechaInicio: {
    type: Date,
  },
  fechaFin: {
    type: Date,
  },
  cliente: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Cliente", // Referencia al modelo de cliente
    required: true,
  },
}, { timestamps: true }); // Incluye `createdAt` y `updatedAt` automáticamente


export const ProyectoModel = mongoose.model("Proyecto", ProyectoSchema);
