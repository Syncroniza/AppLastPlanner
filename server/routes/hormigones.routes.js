import {
    getAllHormigones,
    getHormigonById,
    createHormigon,
    updateHormigon,
    deleteHormigon,
  } from "../controller/hormigones.controller.js";
  
  import { authenticateJWT, checkRole, checkAccessToEntity } from "../middleware/auth.js";
  
  const hormigonRoutes = (app) => {
    // Ruta para obtener todos los registros de hormigón (solo administradores y usuarios con permisos)
    app.get(
      "/hormigones/",
      authenticateJWT,
      checkRole(["admin", "user"]),
      getAllHormigones
    );
  
    // Ruta para obtener un registro específico de hormigón (administradores o usuarios con acceso explícito)
    app.get(
      "/hormigones/:id/",
      authenticateJWT,
      (req, res, next) => {
        const { access } = req.user;
        const hormigonId = req.params.id;
  
        if (!access || !access.hormigones) {
          return res
            .status(403)
            .json({ error: "Acceso denegado: no tienes permisos para ningún registro de hormigón" });
        }
  
        if (access.hormigones.includes(hormigonId)) {
          return next();
        }
  
        return res
          .status(403)
          .json({ error: `Acceso denegado: no tienes permiso para el registro de hormigón ${hormigonId}` });
      },
      getHormigonById
    );
  
    // Ruta para crear un registro de hormigón (solo administradores)
    app.post(
      "/hormigones/",
      authenticateJWT,
      checkRole(["admin","user"]),
      createHormigon
    );
  
    // Ruta para actualizar un registro de hormigón (admin o usuario con acceso explícito)
    app.patch(
      "/hormigones/:id/",
      authenticateJWT,
      (req, res, next) => {
        if (req.user.role === "admin") {
          console.log("Acceso permitido: Administrador para editar registros de hormigón");
          return next();
        }
        checkAccessToEntity("hormigones")(req, res, next);
      },
      updateHormigon
    );
  
    // Ruta para eliminar un registro de hormigón (solo administradores)
    app.delete(
      "/hormigones/:id/",
      authenticateJWT,
      checkRole("admin"),
      deleteHormigon
    );
  };
  
  export default hormigonRoutes;
  