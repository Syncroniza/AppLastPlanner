import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    enum: ["admin", "user"],
    default: "user",
  },
  access: {
    clientes: [{ type: mongoose.Schema.Types.ObjectId, ref: "Cliente" }],
    proyectos: [{ type: mongoose.Schema.Types.ObjectId, ref: "Proyecto" }],
  },
  equipo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "crew", // Nombre del modelo Equipo
  },
});

export default mongoose.model("User", userSchema);