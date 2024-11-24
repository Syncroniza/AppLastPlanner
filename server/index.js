import express from "express";
import cors from "cors";
import mongoConnect from "./config/mongo.config.js";
import "dotenv/config";
import equipoRoutes from "./routes/equipo.routes.js";
import restriccioesRoutes from "./routes/restricciones.routes.js";
import clienteRoutes from "./routes/clientes.routes.js";
import proyectoRoutes from "./routes/proyecto.routes.js";
import authRoutes from "./routes/auth.routes.js";
import user from "./models/user.js";
import bcrypt from "bcryptjs"; 

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const whitelist = ["http://localhost:5173", "http://localhost:5174", "http://localhost:5175"];
app.use(
  cors({
    credentials: true,
    origin: function (origin, callback) {
      if (!origin) return callback(null, true);
      if (whitelist.indexOf(origin) === -1) {
        const message = "The CORS policy for this site does not allow access from the specified Origin.";
        return callback(new Error(message), false);
      }
      return callback(null, true);
    },
  })
);

// Función para crear usuario administrador
const createAdminUser = async () => {
  const adminEmail = process.env.ADMIN_EMAIL;
  const adminPassword = process.env.ADMIN_PASSWORD;

  if (!adminEmail || !adminPassword) {
    console.error("Admin email o password no están configurados en .env");
    return;
  }

  try {
    const existingAdmin = await user.findOne({ email: adminEmail });
    if (existingAdmin) {
      console.log("El usuario administrador ya existe.");
      return;
    }

    const hashedPassword = await bcrypt.hash(adminPassword, 10);
    const adminUser = new user({
      email: adminEmail,
      password: hashedPassword,
      role: "admin", // Opcional: define un rol para diferenciar usuarios
    });

    await adminUser.save();
    console.log("Usuario administrador creado exitosamente.");
  } catch (error) {
    console.error("Error al crear el usuario administrador:", error);
  }
};

// Rutas
equipoRoutes(app);
restriccioesRoutes(app);
clienteRoutes(app);
proyectoRoutes(app);

app.use("/auth", authRoutes); // Rutas para autenticación
console.log("Rutas de autenticación configuradas en /auth");

app.get("/health", (req, res) => {
  res.status(200).send("OK");
});

// Inicia MongoDB y el servidor
const PORT = process.env.PORT || 8000;
mongoConnect().then(async () => {
  await createAdminUser(); // Crea el usuario administrador al iniciar el servidor
  app.listen(PORT, () => {
    console.log(`Servidor escuchando en el puerto ${PORT}`);
  });
});
