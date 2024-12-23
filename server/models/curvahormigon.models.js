import mongoose from "mongoose";

const CurvaHormigonSchema = new mongoose.Schema({
  inicio: {
    type: Date,
    required: true,
  },
  fin: {
    type: Date,
    required: true,
  },
  Hg_Planificado: {
    type: Number,
    required: true,
  },
  cliente: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Cliente',
    required: true,
  },
  proyecto: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Proyecto',
    required: true,
  },
}, {
  timestamps: true, // Crea automáticamente las propiedades createdAt y updatedAt
});

export const CurvaHormigon = mongoose.model("CurvaHormigon", CurvaHormigonSchema);