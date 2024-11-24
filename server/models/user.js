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
    enum: ["admin", "user"], // Define los roles permitidos
    default: "user",
  },
  access: {
    clientes: [{ type: mongoose.Schema.Types.ObjectId, ref: "Cliente" }], // Referencia al modelo Cliente
    proyectos: [{ type: mongoose.Schema.Types.ObjectId, ref: "Proyecto" }], // Referencia al modelo Proyecto
  },
});

export default mongoose.model("User", userSchema);
