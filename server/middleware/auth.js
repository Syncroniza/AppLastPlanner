import jwt from "jsonwebtoken";

const SECRET_KEY = process.env.JWT_SECRET || "your-secret-key";

export const authenticateJWT = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    console.error("Token no proporcionado en la cabecera Authorization.");
    return res.status(403).json({ error: "Token no proporcionado" });
  }

  const token = authHeader.split(" ")[1];
  if (!token) {
    console.error("Token vacío después de dividir el encabezado Authorization.");
    return res.status(403).json({ error: "Token no proporcionado" });
  }

  try {
    const decoded = jwt.verify(token, SECRET_KEY); // Valida el token
    req.user = decoded;
    console.log("Usuario autenticado:", req.user);
    next();
  } catch (error) {
    console.error("Error al verificar el token:", error.message);
    return res.status(401).json({ error: "Token inválido" });
  }
};

export const checkRole = (requiredRole) => {
  return (req, res, next) => {
    const { user } = req;

    let roles =  Array.isArray(requiredRole) ? requiredRole : [requiredRole];

    // Si es administrador, acceso total
    if (user && roles.includes(user.role)) {
      console.log(`Acceso otorgado: ${user.role}`);
      return next();
    }

    console.log(
      `Acceso denegado: Rol requerido: ${requiredRole}, rol del usuario: ${user.role}`
    );
    return res
      .status(403)
      .json({ error: "Acceso denegado: rol insuficiente" });
  };
};



export const checkAccessToEntity = (entityType) => {
  return (req, res, next) => {
    const { user } = req; // El usuario ya está disponible gracias a `authenticateJWT`
    const entityId = req.params.id || req.params.proyectoId || req.body.clienteId;

    console.log(`Verificando acceso para: ${entityType}`);
    console.log(`ID solicitado: ${entityId}`);

    // Si el usuario es administrador, permitir acceso completo
    if (user.role === 'admin') {
      console.log(`Acceso total otorgado al administrador para ${entityType}`);
      return next();
    }

    console.log(`IDs permitidos:`, user.access[entityType]);

    // Si no es administrador, validar los accesos específicos
    const permittedIds = user.access[entityType]?.map((id) => id.toString()) || [];

    if (!permittedIds.includes(entityId?.toString())) {
      return res.status(403).json({
        error: `Acceso denegado: no tienes permiso para este ${entityType}`,
      });
    }

    console.log(`Acceso permitido para ${entityType} con ID: ${entityId}`);
    next();
  };
};

