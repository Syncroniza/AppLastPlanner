import {
  getAllEquipo,
  getOneEquipo,
  createEquipo,
  deleteEquipo,
  editEquipo,
} from "../controller/equipo.controller.js";
import { authenticateJWT, checkRole, checkAccessToEntity } from "../middleware/auth.js"; // Importa los middlewares

const equipoRoutes = (app) => {
  // Ruta para obtener todos los registros de equipo (solo accesible para administradores)
  app.get("/equipo/", authenticateJWT, checkRole("admin"), getAllEquipo);

  // Ruta para obtener un registro específico de equipo (usuarios con acceso)
  app.get(
    "/equipo/:id/",
    authenticateJWT,
    checkAccessToEntity("equipo"), // Verifica acceso a un equipo específico
    getOneEquipo
  );

  // Ruta para crear un registro de equipo (solo administradores)
  app.post(
    "/equipo/",
    authenticateJWT,
    checkRole("admin"), // Solo los administradores pueden crear registros de equipo
    createEquipo
  );

  // Ruta para eliminar un registro de equipo (solo administradores)
  app.delete(
    "/equipo/:id/",
    authenticateJWT,
    checkRole("admin"), // Solo los administradores pueden eliminar registros de equipo
    deleteEquipo
  );

  // Ruta para editar un registro de equipo (solo administradores)
  app.patch(
    "/equipo/:id/",
    authenticateJWT,
    checkRole("admin"), // Solo los administradores pueden editar registros de equipo
    editEquipo
  );
};

export default equipoRoutes;
