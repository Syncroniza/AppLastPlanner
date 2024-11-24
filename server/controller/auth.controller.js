import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import mongoose from "mongoose"; // Asegúrate de importar mongoose
import User from "../models/user.js";

const SECRET_KEY = process.env.JWT_SECRET || "your-secret-key";

// Registro de usuario
export const register = async (req, res) => {
  const { email, password, role = "user", access = { clientes: [], proyectos: [] } } = req.body;

  try {
    // Verifica si el usuario ya existe
    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ error: "El usuario ya está registrado" });

    // Valida y convierte los IDs a ObjectId
    const validatedAccess = {
      clientes: access.clientes.map((id) => new mongoose.Types.ObjectId(id)), // Usar `new`
      proyectos: access.proyectos.map((id) => new mongoose.Types.ObjectId(id)), // Usar `new`
    };

    // Hashea la contraseña
    const hashedPassword = await bcrypt.hash(password, 10);

    // Crea el nuevo usuario
    const newUser = new User({
      email,
      password: hashedPassword,
      role,
      access: validatedAccess,
    });
    await newUser.save();

    res.status(201).json({ message: "Usuario registrado exitosamente" });
  } catch (error) {
    console.error("Error al registrar el usuario:", error);
    res.status(500).json({ error: "Error al registrar el usuario" });
  }
};

export const login = async (req, res) => {
  console.log("Datos recibidos en login:", req.body);

  try {
    const user = await User.findOne({ email: req.body.email });
    console.log("Usuario encontrado:", user);

    if (!user) return res.status(404).json({ error: "Usuario no encontrado" });

    const isPasswordValid = await bcrypt.compare(req.body.password, user.password);
    console.log("Contraseña válida:", isPasswordValid);

    if (!isPasswordValid) return res.status(401).json({ error: "Contraseña incorrecta" });

    const token = jwt.sign(
      {
        id: user._id,
        email: user.email,
        role: user.role,
        access: user.access,
      },
      SECRET_KEY,
      { expiresIn: "1h" }
    );
    console.log("Token generado:", token);

    res.status(200).json({ token });
  } catch (error) {
    console.error("Error al iniciar sesión:", error);
    res.status(500).json({ error: "Error al iniciar sesión" });
  }
};


// Verificar token
export const verifyToken = (req, res) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(403).json({ error: "Token no proporcionado" });

  try {
    const decoded = jwt.verify(token, SECRET_KEY);
    res.status(200).json({ message: "Token válido", user: decoded });
  } catch (error) {
    res.status(401).json({ error: "Token inválido" });
  }
};
