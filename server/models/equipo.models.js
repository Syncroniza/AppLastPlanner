import mongoose from "mongoose";

const EquipoSchema = new mongoose.Schema(
  {
    nombre: {
      type: String,
      required: true,
    },
    apellido: {
      type: String,
      required: true,
    },
    empresa: {
      type: String,
      required: true,
    },
    correo: {
      type: String,
      required: true,
      match: [/.+@.+\..+/, "Por favor ingrese un correo válido"],
    },
    cargo: {
      type: String,
      required: true,
    },
    cliente: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Cliente", // Nombre del modelo de cliente
      required: true,
    },
    proyecto: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Proyecto", // Nombre del modelo de proyecto
      required: true,
    },
    aliases: [
      {
        type: String,
      },
    ],
  },
  {
    timestamps: true, // Para añadir createdAt y updatedAt automáticamente
  }
);

export const EquipoModel = mongoose.model("crew", EquipoSchema);
