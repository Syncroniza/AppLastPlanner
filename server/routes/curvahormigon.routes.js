// routes/curvahormigon.routes.js

import {
    getAllCurvaHormigones,
    getCurvaHormigonById,
    createCurvaHormigon,
    updateCurvaHormigon,
    deleteCurvaHormigon,
  } from "../controller/curvahormigon.controller.js";
  
  import { authenticateJWT, checkRole, checkAccessToEntity } from "../middleware/auth.js";
  
  const curvaHormigonRoutes = (app) => {
    // Ruta para obtener todos los registros de curva de hormigón
    app.get(
      "/curvahormigon/",
      authenticateJWT,
      checkRole(["admin", "user"]),
      getAllCurvaHormigones
    );
  
    // Ruta para obtener un registro específico de curva de hormigón
    app.get(
      "/curvahormigon/:id/",
      authenticateJWT,
      (req, res, next) => {
        const { access } = req.user;
        const curvaHormigonId = req.params.id;
  
        if (!access || !access.curvahormigon) {
          return res
            .status(403)
            .json({ error: "Acceso denegado: no tienes permisos para ningún registro de curva de hormigón" });
        }
  
        if (access.curvahormigon.includes(curvaHormigonId)) {
          return next();
        }
  
        return res
          .status(403)
          .json({ error: `Acceso denegado: no tienes permiso para el registro de curva de hormigón ${curvaHormigonId}` });
      },
      getCurvaHormigonById
    );
  
    // Ruta para crear un nuevo registro de curva de hormigón
    app.post(
      "/curvahormigon/",
      authenticateJWT,
      checkRole(["admin", "user"]),
      createCurvaHormigon
    );
  
    // Ruta para actualizar un registro de curva de hormigón
    app.patch(
      "/curvahormigon/:id/",
      authenticateJWT,
      (req, res, next) => {
        if (req.user.role === "admin") {
          console.log("Acceso permitido: Administrador para editar registros de curva de hormigón");
          return next();
        }
        checkAccessToEntity("curvahormigon")(req, res, next);
      },
      updateCurvaHormigon
    );
  
    // Ruta para eliminar un registro de curva de hormigón
    app.delete(
      "/curvahormigon/:id/",
      authenticateJWT,
      checkRole("admin"),
      deleteCurvaHormigon
    );
  };
  
  export default curvaHormigonRoutes;