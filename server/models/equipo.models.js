import mongoose from "mongoose";

const EquipoSchema = new mongoose.Schema(
  {
    id: {
      type: String,
    },
    nombre: {
      type: String,
    },
    apellido: {
      type: String,
    },
    empresa: {
      type: String,
    },
    telefono: {
      type: String,
    },
    correo: {
      type: String,
    },
    cargo: {
      type: String,
    },
    aliases: [
      {
        type: String,
      },
    ],
  },
  {
    timestamps: true,
  }
);

export const EquipoModel = mongoose.model("crew", EquipoSchema);
