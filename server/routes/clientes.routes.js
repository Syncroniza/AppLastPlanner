import {
  getAllClientes,
  getClienteById,
  createCliente,
  updateCliente,
  deleteCliente,
} from "../controller/cliente.controller.js";
import { authenticateJWT, checkRole, checkAccessToEntity } from "../middleware/auth.js";

const clienteRoutes = (app) => {
  // Ruta para obtener todos los clientes (acceso completo para administradores, acceso filtrado para usuarios)
  app.get(
    "/clientes/",
    authenticateJWT,
    (req, res, next) => {
      if (req.user.role === "admin") {
        // Si es admin, permite el acceso completo
        return next();
      } else {
        // Si es usuario, verifica acceso por cliente
        req.params.id = req.user.access.clientes; // Establece los IDs permitidos en la solicitud
        return checkAccessToEntity("clientes")(req, res, next);
      }
    },
    getAllClientes
  );

  // Ruta para obtener un cliente específico
  app.get(
    "/clientes/:id/",
    authenticateJWT,
    checkAccessToEntity("clientes"), // Verifica acceso al cliente
    getClienteById
  );

  // Ruta para crear un cliente (solo administradores)
  app.post(
    "/clientes/",
    authenticateJWT,
    checkRole("admin"), // Solo administradores pueden crear clientes
    createCliente
  );

  // Ruta para actualizar un cliente (solo administradores)
  app.patch(
    "/clientes/:id/",
    authenticateJWT,
    checkRole("admin"), // Solo administradores pueden actualizar clientes
    updateCliente
  );

  // Ruta para eliminar un cliente (solo administradores)
  app.delete(
    "/clientes/:id/",
    authenticateJWT,
    checkRole("admin"), // Solo administradores pueden eliminar clientes
    deleteCliente
  );
};

export default clienteRoutes;
