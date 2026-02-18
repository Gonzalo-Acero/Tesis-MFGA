import {
  findAllGuides,
  findGuideById,
  findGuideByNameOrAlias,
  findCommentsByGuideId,
  insertGuideComment,
  insertGuideMessage,
  upsertGuideRating,
  getGuideRatingSummary,
} from "../models/guideModel.js";

const getGuides = async (_req, res) => {
  try {
    const guides = await findAllGuides();
    return res.json(guides);
  } catch (error) {
    console.error("Error al obtener guias:", error);
    return res
      .status(500)
      .json({ message: "Error interno al obtener guias" });
  }
};

const resolveGuideByName = async (req, res) => {
  const name = req.query?.name?.trim();
  if (!name) {
    return res.status(400).json({ message: "Nombre de guia requerido" });
  }

  try {
    const guide = await findGuideByNameOrAlias(name);
    if (!guide) {
      return res.status(404).json({ message: "Guia no encontrado" });
    }

    const summary = await getGuideRatingSummary(guide.GuideId);
    return res.json({
      ...guide,
      ratingAverage: summary?.Average ?? null,
      ratingCount: summary?.Count ?? 0,
    });
  } catch (error) {
    console.error("Error al resolver guia por nombre:", error);
    return res
      .status(500)
      .json({ message: "Error interno al resolver guia" });
  }
};

const getGuideById = async (req, res) => {
  const { id } = req.params;
  try {
    const guide = await findGuideById(id);
    if (!guide) {
      return res.status(404).json({ message: "Guia no encontrado" });
    }

    const summary = await getGuideRatingSummary(id);
    return res.json({
      ...guide,
      ratingAverage: summary?.Average ?? null,
      ratingCount: summary?.Count ?? 0,
    });
  } catch (error) {
    console.error("Error al obtener guia:", error);
    return res
      .status(500)
      .json({ message: "Error interno al obtener guia" });
  }
};

const getGuideComments = async (req, res) => {
  const { id } = req.params;
  try {
    const guide = await findGuideById(id);
    if (!guide) {
      return res.status(404).json({ message: "Guia no encontrado" });
    }

    const comments = await findCommentsByGuideId(id);
    return res.json(comments);
  } catch (error) {
    console.error("Error al obtener comentarios:", error);
    return res
      .status(500)
      .json({ message: "Error interno al obtener comentarios" });
  }
};

const addGuideComment = async (req, res) => {
  const { id } = req.params;
  const comment = req.body?.comment?.trim();
  const userId = req.user?.UserId;

  if (!userId) {
    return res.status(401).json({ message: "Usuario no autenticado" });
  }

  if (!comment) {
    return res.status(400).json({ message: "Comentario es obligatorio" });
  }

  try {
    const guide = await findGuideById(id);
    if (!guide) {
      return res.status(404).json({ message: "Guia no encontrado" });
    }

    const inserted = await insertGuideComment({
      guideId: id,
      userId,
      comment,
    });

    return res.status(201).json(inserted);
  } catch (error) {
    console.error("Error al crear comentario:", error);
    return res
      .status(500)
      .json({ message: "Error interno al crear comentario" });
  }
};

const addGuideRating = async (req, res) => {
  const { id } = req.params;
  const rating = Number(req.body?.rating);
  const userId = req.user?.UserId;

  if (!userId) {
    return res.status(401).json({ message: "Usuario no autenticado" });
  }

  if (!Number.isFinite(rating) || rating < 1 || rating > 5) {
    return res
      .status(400)
      .json({ message: "Rating debe ser un numero entre 1 y 5" });
  }

  try {
    const guide = await findGuideById(id);
    if (!guide) {
      return res.status(404).json({ message: "Guia no encontrado" });
    }

    await upsertGuideRating({ guideId: id, userId, rating });
    const summary = await getGuideRatingSummary(id);

    return res.json({
      ratingAverage: summary?.Average ?? null,
      ratingCount: summary?.Count ?? 0,
    });
  } catch (error) {
    console.error("Error al guardar rating:", error);
    return res
      .status(500)
      .json({ message: "Error interno al guardar rating" });
  }
};

const sendGuideMessage = async (req, res) => {
  const { id } = req.params;
  const message = req.body?.message?.trim();
  const userId = req.user?.UserId;

  if (!userId) {
    return res.status(401).json({ message: "Usuario no autenticado" });
  }

  if (!message) {
    return res.status(400).json({ message: "Mensaje es obligatorio" });
  }

  try {
    const guide = await findGuideById(id);
    if (!guide) {
      return res.status(404).json({ message: "Guia no encontrado" });
    }

    await insertGuideMessage({
      guideId: id,
      userId,
      message,
    });

    return res.json({ message: "Mensaje enviado" });
  } catch (error) {
    console.error("Error al enviar mensaje:", error);
    return res
      .status(500)
      .json({ message: "Error interno al enviar mensaje" });
  }
};

export {
  getGuides,
  resolveGuideByName,
  getGuideById,
  getGuideComments,
  addGuideComment,
  addGuideRating,
  sendGuideMessage,
};
