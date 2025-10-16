import { User } from "../models/userModel.js";
import bcrypt from "bcryptjs";

const sanitizeUser = (userInstance) => {
  if (!userInstance) {
    return null;
  }
  const userJson = userInstance.toJSON();
  delete userJson.Password;
  return userJson;
};

const getUsers = async (req, res) => {
  try {
    const users = await User.findAll({
      attributes: { exclude: ["Password"] },
    });
    console.log("Lista de usuarios obtenida:", users);
    res.json(users);
  } catch (error) {
    console.error("Error al obtener todos los usuarios:", error);
    res
      .status(500)
      .json({ error: "Error interno del servidor al obtener usuarios" });
  }
};

const getUserById = async (req, res) => {
  const { id } = req.params;
  try {
    const user = await User.findByPk(id, {
      attributes: { exclude: ["Password"] },
    });
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
  const requiredFields = ["Name", "Email", "Password"];
  const missingFields = requiredFields.filter((field) => {
    const value = req.body?.[field];
    return value === undefined || value === null || value === "";
  });

  if (missingFields.length) {
    return res.status(400).json({
      error: `Faltan campos obligatorios: ${missingFields.join(", ")}`,
    });
  }

  try {
    const existingUser = await User.findOne({
      where: { Email: req.body.Email },
    });

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

    const newUser = await User.create(payload);
    const safeUser = sanitizeUser(newUser);
    res.status(201).json(safeUser);
    console.log("Usuario creado:", newUser.toJSON());
  } catch (error) {
    console.error("Error al crear usuario:", error);
    res
      .status(500)
      .json({ error: "Error interno del servidor al crear usuario" });
  }
};

const updateUser = async (req, res) => {
  const { id } = req.params;
  console.log("ID del usuario a actualizar:", id);
  console.log("Datos del usuario a actualizar:", req.body);

  const userData = { ...req.body };

  try {
    if (userData.Password) {
      userData.Password = await bcrypt.hash(userData.Password, 10);
    }

    if (userData.Email) {
      const existingUser = await User.findOne({
        where: { Email: userData.Email },
      });

      if (existingUser && String(existingUser.UserId) !== String(id)) {
        return res
          .status(409)
          .json({ error: "El correo electronico ya esta registrado" });
      }
    }

    const [rowsAffected] = await User.update(userData, {
      where: { UserId: id },
    });

    if (rowsAffected === 0) {
      return res.status(404).json({ error: "Usuario no encontrado" });
    }

    const updatedUser = await User.findByPk(id, {
      attributes: { exclude: ["Password"] },
    });
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
    const rowsDeleted = await User.destroy({
      where: { UserId: id },
    });
    res.json({ "Usuario eliminado": rowsDeleted > 0 });
    console.log("Usuario eliminado:", rowsDeleted > 0);
  } catch (error) {
    console.error("Error al eliminar usuario:", error);
    res
      .status(500)
      .json({ error: "Error interno del servidor al eliminar usuario" });
  }
};

export { getUsers, getUserById, addUser, updateUser, deleteUser };
