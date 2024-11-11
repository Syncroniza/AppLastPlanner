import {
    getAllProyectos,
    getProyectoById,
    createProyecto,
    updateProyecto,
    deleteProyecto,
  } from "../controller/proyecto.controller.js";
  
  const proyectoRoutes = (app) => {
    app.get("/proyectos/", getAllProyectos);
    app.get("/proyectos/:id/", getProyectoById);
    app.post("/proyectos/", createProyecto);
    app.patch("/proyectos/:id/", updateProyecto);
    app.delete("/proyectos/:id/", deleteProyecto);
  };
  
  export default proyectoRoutes;
  