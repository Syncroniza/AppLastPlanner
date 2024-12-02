import { Admin } from "mongodb";
import {
  getAllRestriciones,
  getOneRestricciones,
  createRestricciones,
  deleteRestricciones,
  editRestricciones,
} from "../controller/restricciones.controller.js";
import { authenticateJWT, checkAccessToEntity, checkRole } from "../middleware/auth.js";

const restriccioesRoutes = (app) => {
  // Ruta para obtener todas las restricciones
  app.get(
    "/restricciones/",
    authenticateJWT,
    checkRole(["admin","user"]),
    getAllRestriciones
  );

  // Ruta para obtener restricciones de un proyecto específico
  app.get(
    "/restricciones/proyecto/:proyectoId",
    authenticateJWT,
    checkRole(["admin","user"]),
    getOneRestricciones
  );
  

  // Ruta para crear restricciones
  app.post(
    '/restricciones/',
    authenticateJWT,
    checkRole(['admin', 'user']),
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
    checkRole(["admin", "user"]), // Admin y user pueden editar restricciones
    editRestricciones
  );
};

export default restriccioesRoutes;
