import bcrypt from "bcryptjs";
import {
  findAllUsers,
  findUserById,
  findUserByEmailWithPassword,
  insertUser,
  updateUserById,
  deleteUserById,
} from "../models/userModel.js";

const requiredFields = ["Name", "Email", "Password"];

const buildMissingFieldsMessage = (body) => {
  const missing = requiredFields.filter((field) => {
    const value = body?.[field];
    return value === undefined || value === null || value === "";
  });

  if (!missing.length) {
    return null;
  }

  return `Faltan campos obligatorios: ${missing.join(", ")}`;
};

const getUsers = async (_req, res) => {
  try {
    const users = await findAllUsers();
    res.json(users);
  } catch (error) {
    console.error("Error al obtener todos los usuarios:", error);
    res
      .status(500)
      .json({ error: "Error interno del servidor al obtener usuarios" });
  }
};

const getUserByIdController = async (req, res) => {
  const { id } = req.params;
  try {
    const user = await findUserById(id);
    if (!user) {
      return res.status(404).json({ error: "Usuario no encontrado" });
    }
    res.json(user);
  } catch (error) {
    console.error("Error al obtener usuario por ID:", error);
    res
      .status(500)
      .json({ error: "Error interno del servidor al obtener usuario" });
  }
};

const addUser = async (req, res) => {
  const missingMessage = buildMissingFieldsMessage(req.body);
  if (missingMessage) {
    return res.status(400).json({ error: missingMessage });
  }

  try {
    const existingUser = await findUserByEmailWithPassword(req.body.Email);
    if (existingUser) {
      return res
        .status(409)
        .json({ error: "El correo electronico ya esta registrado" });
    }

    const hashedPassword = await bcrypt.hash(req.body.Password, 10);
    const payload = {
      ...req.body,
      Password: hashedPassword,
      CreationDate: req.body.CreationDate ?? new Date(),
      IsActive: req.body.IsActive ?? true,
    };

    const newUser = await insertUser(payload);
    res.status(201).json(newUser);
    console.log("Usuario creado:", newUser);
  } catch (error) {
    console.error("Error al crear usuario:", error);
    res
      .status(500)
      .json({ error: "Error interno del servidor al crear usuario" });
  }
};

const updateUser = async (req, res) => {
  const { id } = req.params;
  const updates = { ...req.body };

  try {
    if (updates.Email) {
      const existingUser = await findUserByEmailWithPassword(updates.Email);
      if (existingUser && String(existingUser.UserId) !== String(id)) {
        return res
          .status(409)
          .json({ error: "El correo electronico ya esta registrado" });
      }
    }

    if (updates.Password) {
      updates.Password = await bcrypt.hash(updates.Password, 10);
    }

    const updatedUser = await updateUserById(id, updates);
    if (!updatedUser) {
      return res.status(404).json({ error: "Usuario no encontrado" });
    }

    res.json(updatedUser);
    console.log("Usuario actualizado:", updatedUser);
  } catch (error) {
    console.error("Error al actualizar usuario:", error);
    res
      .status(500)
      .json({ error: "Error interno del servidor al actualizar usuario" });
  }
};

const deleteUser = async (req, res) => {
  const { id } = req.params;
  try {
    const deletedRows = await deleteUserById(id);
    res.json({ "Usuario eliminado": deletedRows > 0 });
    console.log("Usuario eliminado:", deletedRows > 0);
  } catch (error) {
    console.error("Error al eliminar usuario:", error);
    res
      .status(500)
      .json({ error: "Error interno del servidor al eliminar usuario" });
  }
};

export {
  getUsers,
  getUserByIdController as getUserById,
  addUser,
  updateUser,
  deleteUser,
};
