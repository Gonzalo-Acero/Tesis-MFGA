import bcrypt from "bcryptjs";
import {
  findUserByEmailWithPassword,
  findUserByIdWithPassword,
  findUserByVerificationToken,
  updateUserById,
} from "../models/userModel.js";
import { defaultLoginUrl } from "../services/mailService.js";

const buildInvalidCredentialsResponse = (res) =>
  res.status(401).json({ message: "Credenciales invalidas" });

const sanitizeUser = (user) => {
  if (!user) return null;
  const { Password, verification_token, token_expires_at, ...rest } = user;
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

    if (user.is_verified === false) {
      // Si es una cuenta antigua sin token de verificacion, la marcamos como verificada para no bloquearla
      if (!user.verification_token) {
        await updateUserById(user.UserId, { is_verified: true });
        user.is_verified = true;
      } else {
        return res
          .status(403)
          .json({ message: "Debes verificar tu correo antes de iniciar sesion" });
      }
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

const verifyEmail = async (req, res) => {
  const { token } = req.query ?? {};
  if (!token) {
    return res.status(400).json({ message: "Token de verificacion faltante" });
  }

  try {
    const user = await findUserByVerificationToken(token);
    if (!user) {
      return res.status(404).json({ message: "Token invalido o ya usado" });
    }

    if (user.token_expires_at && new Date(user.token_expires_at) < new Date()) {
      return res.status(400).json({ message: "Token expirado" });
    }

    await updateUserById(user.UserId, {
      is_verified: true,
      verification_token: null,
      token_expires_at: null,
    });

    const redirectUrl = defaultLoginUrl;
    return res.redirect(302, redirectUrl);
  } catch (error) {
    console.error("Error al verificar correo:", error);
    return res
      .status(500)
      .json({ message: "Error interno del servidor al verificar correo" });
  }
};

export { login, changePassword, verifyEmail };
