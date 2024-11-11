import mongoose from "mongoose";

const ClienteSchema = new mongoose.Schema({
  nombre: {
    type: String,
    required: true,
  },
  email: {
    type: String,
  },
  telefono: {
    type: String,
  },
  direccion: {
    type: String,
  },
  proyectos: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Proyecto", // Nombre del modelo de proyecto
    }
  ],
});

export const ClienteModel = mongoose.model("Cliente", ClienteSchema);
