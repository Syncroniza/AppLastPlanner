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
  app.get(
    "/equipo/", 
    authenticateJWT, 
    checkRole(["admin","user"]), 
    getAllEquipo);

  
};

export default equipoRoutes;
