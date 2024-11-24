import {
  getAllRestriciones,
  getOneRestricciones,
  createRestricciones,
  deleteRestricciones,
  editRestricciones,
} from "../controller/restricciones.controller.js";
import { authenticateJWT, checkAccessToEntity } from "../middleware/auth.js";

const restriccioesRoutes = (app) => {
  // Ruta para obtener todas las restricciones
  app.get(
    "/restricciones/",
    authenticateJWT,
    (req, res, next) => {
      if (req.user.role === "admin") {
        console.log("Acceso otorgado: Administrador a todas las restricciones");
        return next(); // Administradores tienen acceso total
      }
      return res
        .status(403)
        .json({ error: "Acceso denegado: Solo los administradores pueden acceder a todas las restricciones" });
    },
    getAllRestriciones
  );

  // Ruta para obtener restricciones de un proyecto específico
  app.get(
    "/restricciones/proyecto/:proyectoId",
    authenticateJWT,
    (req, res, next) => {
      if (req.user.role === "admin" || req.user.role === "user") {
        console.log("Acceso permitido: Administrador a restricciones de proyectos");
        return next(); // Administradores tienen acceso total
      }
      checkAccessToEntity("proyectos")(req, res, next); // Usuarios necesitan permisos explícitos
    },
    getOneRestricciones
  );
  

  // Ruta para crear restricciones
  app.post(
    "/restricciones/",
    authenticateJWT,
    (req, res, next) => {
      if (req.user.role === "admin") {
        console.log("Acceso permitido: Administrador puede crear restricciones");
        return next(); // Administradores pueden crear restricciones
      }
      return res
        .status(403)
        .json({ error: "Acceso denegado: Solo los administradores pueden crear restricciones" });
    },
    createRestricciones
  );

  // Ruta para eliminar una restricción
  app.delete(
    "/restricciones/:id/",
    authenticateJWT,
    (req, res, next) => {
      if (req.user.role === "admin") {
        console.log("Acceso permitido: Administrador puede eliminar restricciones");
        return next();
      }
      return res
        .status(403)
        .json({ error: "Acceso denegado: Solo los administradores pueden eliminar restricciones" });
    },
    deleteRestricciones
  );

  // Ruta para editar una restricción
  app.patch(
    "/restricciones/:id/",
    authenticateJWT,
    (req, res, next) => {
      if (req.user.role === "admin") {
        console.log("Acceso permitido: Administrador puede editar restricciones");
        return next();
      }
      return res
        .status(403)
        .json({ error: "Acceso denegado: Solo los administradores pueden editar restricciones" });
    },
    editRestricciones
  );
};

export default restriccioesRoutes;
