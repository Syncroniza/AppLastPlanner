import {
  getAllProyectos,
  getProyectoById,
  createProyecto,
  updateProyecto,
  deleteProyecto,
} from "../controller/proyecto.controller.js";

import { authenticateJWT, 
  checkRole,
  checkAccessToEntity } 
  from "../middleware/auth.js";

const proyectoRoutes = (app) => {
  // Ruta para obtener todos los proyectos (solo administradores)
  
  app.get(
    "/proyectos/", 
    authenticateJWT, 
    checkRole(["admin", "user"]), 
    getAllProyectos);

  // Ruta para obtener un proyecto específico (administradores o usuarios con acceso explícito)
  app.get(
    "/proyectos/:id/",
    authenticateJWT,
    (req, res, next) => {
      const { access } = req.user;
      const projectId = req.params.id;
  
      if (!access || !access.proyectos) {
        return res
          .status(403)
          .json({ error: "Acceso denegado: no tienes permisos para ningún proyecto" });
      }
  
      if (access.proyectos.includes(projectId)) {
        return next();
      }
  
      return res
        .status(403)
        .json({ error: `Acceso denegado: no tienes permiso para el proyecto ${projectId}` });
    },
    getProyectoById // Este debería ser tu controlador real para obtener los detalles del proyecto
  );
  
  

  // Ruta para crear un proyecto (solo administradores)
  app.post(
    "/proyectos/", 
    authenticateJWT, 
    checkRole("admin"), 
    createProyecto);

  // Ruta para actualizar un proyecto (admin o usuario con acceso explícito)
  app.patch(
    "/proyectos/:id/",
    authenticateJWT,
    (req, res, next) => {
      if (req.user.role === "admin") {
        console.log("Acceso permitido: Administrador para editar proyectos");
        return next();
      }
      checkAccessToEntity("proyectos")(req, res, next);
    },
    updateProyecto
  );

  // Ruta para eliminar un proyecto (solo administradores)
  app.delete("/proyectos/:id/", authenticateJWT, checkRole("admin"), deleteProyecto);
};

export default proyectoRoutes;
