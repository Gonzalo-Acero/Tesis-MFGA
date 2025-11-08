import bcrypt from "bcryptjs";
import {
  findUserByEmailWithPassword,
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

export { login };
