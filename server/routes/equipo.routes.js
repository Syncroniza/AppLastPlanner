import {
  getAllEquipo,
  getOneEquipo,
  createEquipo,
  deleteEquipo,
  editEquipo,
} from "../controller/equipo.controller.js";

const equipoRoutes = (app) => {
  app.get("/equipo/", getAllEquipo);
  app.get("/equipo/:id/", getOneEquipo);
  app.post("/equipo/", createEquipo);
  app.delete("/equipo/:id/", deleteEquipo);
  app.patch("/equipo/:id/", editEquipo);
};

export default equipoRoutes;
