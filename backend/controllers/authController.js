import bcrypt from "bcryptjs";
import {
  findUserByEmailWithPassword,
  findUserByIdWithPassword,
  updateUserById,
} from "../models/userModel.js";

const buildInvalidCredentialsResponse = (res) =>
  res.status(401).json({ message: "Credenciales invalidas" });

const sanitizeUser = (user) => {
  if (!user) return null;
  const { Password, ...rest } = user;
  return rest;
};

const login = async (req, res) => {
  const { email, password } = req.body ?? {};

  if (!email || !password) {
    return res
      .status(400)
      .json({ message: "Email y contrasena son obligatorios" });
  }

  try {
    const user = await findUserByEmailWithPassword(email);
    if (!user) {
      return buildInvalidCredentialsResponse(res);
    }

    const isValidPassword = await bcrypt.compare(password, user.Password ?? "");
    if (!isValidPassword) {
      return buildInvalidCredentialsResponse(res);
    }

    const lastLogin = new Date();
    await updateUserById(user.UserId, { LastLogin: lastLogin });

    return res.json({
      message: "Login exitoso",
      user: sanitizeUser({ ...user, LastLogin: lastLogin }),
    });
  } catch (error) {
    console.error("Error al iniciar sesion:", error);
    return res
      .status(500)
      .json({ message: "Error interno del servidor al iniciar sesion" });
  }
};

const changePassword = async (req, res) => {
  const { userId, currentPassword, newPassword } = req.body ?? {};

  if (!userId || !currentPassword || !newPassword) {
    return res
      .status(400)
      .json({ message: "Faltan datos para actualizar la contrasena" });
  }

  if (String(newPassword).length < 6) {
    return res
      .status(400)
      .json({ message: "La nueva contrasena debe tener al menos 6 caracteres" });
  }

  try {
    const user = await findUserByIdWithPassword(userId);
    if (!user) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    const currentMatches = await bcrypt.compare(
      currentPassword,
      user.Password ?? ""
    );
    if (!currentMatches) {
      return res
        .status(401)
        .json({ message: "La contrasena actual no es correcta" });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await updateUserById(user.UserId, { Password: hashedPassword });

    return res.json({ message: "Contrasena actualizada correctamente" });
  } catch (error) {
    console.error("Error al cambiar contrasena:", error);
    return res
      .status(500)
      .json({ message: "Error interno del servidor al cambiar contrasena" });
  }
};

export { login, changePassword };
