import {
  findAllCommunityPosts,
  findCommunityPostById,
  insertCommunityPost,
  findCommentsByPostId,
  insertCommunityPostComment,
  countCommentsByPostId,
  findLikedPostIdsByUserId,
  hasUserLikedPost,
  insertCommunityPostLike,
  deleteCommunityPostLike,
  countLikesByPostId,
} from "../models/communityModel.js";

const VALID_CATEGORIES = new Set([
  "tips",
  "food",
  "adventure",
  "culture",
  "question",
]);

const normalizeText = (value) => String(value ?? "").trim();
const parsePositiveInteger = (value) => {
  const parsed = Number(value);
  if (!Number.isInteger(parsed) || parsed <= 0) return null;
  return parsed;
};

const toCommunityPostPayload = (row) => {
  if (!row) return null;
  return {
    id: row.PostId,
    userId: row.UserId,
    author: row.AuthorName || "MFGA Explorer",
    avatar: "https://static.photos/people/200x200/42",
    location: row.Location || "Argentina",
    region: row.Region || "All Regions",
    category: row.Category || "tips",
    message: row.Message || "",
    image: row.ImageUrl || null,
    createdAt: row.CreatedAt,
    likeCount: Number(row.LikeCount || 0),
    commentCount: Number(row.CommentCount || 0),
  };
};

const toCommentPayload = (row) => {
  if (!row) return null;
  return {
    id: row.PostCommentId,
    postId: row.PostId,
    userId: row.UserId,
    userName: row.UserName || "MFGA Explorer",
    comment: row.Comment || "",
    createdAt: row.CreatedAt,
  };
};

const getCommunityPosts = async (req, res) => {
  const { limit } = req.query ?? {};
  try {
    const rows = await findAllCommunityPosts({ limit });
    return res.json(rows.map((row) => toCommunityPostPayload(row)));
  } catch (error) {
    console.error("Error al obtener publicaciones de community:", error);
    return res
      .status(500)
      .json({ message: "Error interno al obtener publicaciones" });
  }
};

const addCommunityPost = async (req, res) => {
  const userId = parsePositiveInteger(req.user?.UserId);
  if (!userId) {
    return res.status(401).json({ message: "Usuario no autenticado" });
  }

  const category = normalizeText(req.body?.category || "tips").toLowerCase();
  const location = normalizeText(req.body?.location || "Argentina");
  const region = normalizeText(req.body?.region || "All Regions");
  const message = normalizeText(req.body?.message);
  const imageUrl = normalizeText(req.body?.imageUrl) || null;

  if (!VALID_CATEGORIES.has(category)) {
    return res.status(400).json({ message: "Categoria invalida" });
  }

  if (message.length < 12) {
    return res
      .status(400)
      .json({ message: "La publicacion debe tener al menos 12 caracteres" });
  }

  try {
    const inserted = await insertCommunityPost({
      userId,
      category,
      location,
      region,
      message,
      imageUrl,
    });

    if (!inserted) {
      return res.status(500).json({ message: "No se pudo crear la publicacion" });
    }

    return res.status(201).json(toCommunityPostPayload(inserted));
  } catch (error) {
    console.error("Error al crear publicacion de community:", error);
    return res.status(500).json({ message: "Error interno al crear publicacion" });
  }
};

const getCommunityPostComments = async (req, res) => {
  const postId = parsePositiveInteger(req.params?.id);
  if (!postId) {
    return res.status(400).json({ message: "Id de publicacion invalido" });
  }

  try {
    const post = await findCommunityPostById(postId);
    if (!post) {
      return res.status(404).json({ message: "Publicacion no encontrada" });
    }

    const rows = await findCommentsByPostId(postId, { limit: req.query?.limit });
    return res.json(rows.map((row) => toCommentPayload(row)));
  } catch (error) {
    console.error("Error al obtener comentarios de community:", error);
    return res.status(500).json({ message: "Error interno al obtener comentarios" });
  }
};

const addCommunityPostComment = async (req, res) => {
  const postId = parsePositiveInteger(req.params?.id);
  const userId = parsePositiveInteger(req.user?.UserId);
  const comment = normalizeText(req.body?.comment);

  if (!postId) {
    return res.status(400).json({ message: "Id de publicacion invalido" });
  }

  if (!userId) {
    return res.status(401).json({ message: "Usuario no autenticado" });
  }

  if (!comment) {
    return res.status(400).json({ message: "Comentario obligatorio" });
  }

  try {
    const post = await findCommunityPostById(postId);
    if (!post) {
      return res.status(404).json({ message: "Publicacion no encontrada" });
    }

    const insertedComment = await insertCommunityPostComment({
      postId,
      userId,
      comment,
    });
    const commentCount = await countCommentsByPostId(postId);

    return res.status(201).json({
      comment: toCommentPayload(insertedComment),
      commentCount,
    });
  } catch (error) {
    console.error("Error al crear comentario de community:", error);
    return res.status(500).json({ message: "Error interno al crear comentario" });
  }
};

const getMyLikedPostIds = async (req, res) => {
  const userId = parsePositiveInteger(req.user?.UserId);
  if (!userId) {
    return res.status(401).json({ message: "Usuario no autenticado" });
  }

  try {
    const postIds = await findLikedPostIdsByUserId(userId);
    return res.json(postIds);
  } catch (error) {
    console.error("Error al obtener likes del usuario:", error);
    return res.status(500).json({ message: "Error interno al obtener likes" });
  }
};

const toggleCommunityPostLike = async (req, res) => {
  const postId = parsePositiveInteger(req.params?.id);
  const userId = parsePositiveInteger(req.user?.UserId);

  if (!postId) {
    return res.status(400).json({ message: "Id de publicacion invalido" });
  }

  if (!userId) {
    return res.status(401).json({ message: "Usuario no autenticado" });
  }

  try {
    const post = await findCommunityPostById(postId);
    if (!post) {
      return res.status(404).json({ message: "Publicacion no encontrada" });
    }

    const liked = await hasUserLikedPost({ postId, userId });
    if (liked) {
      await deleteCommunityPostLike({ postId, userId });
    } else {
      await insertCommunityPostLike({ postId, userId });
    }

    const likeCount = await countLikesByPostId(postId);
    return res.json({
      liked: !liked,
      likeCount,
    });
  } catch (error) {
    console.error("Error al alternar like de community:", error);
    return res.status(500).json({ message: "Error interno al guardar like" });
  }
};

export {
  getCommunityPosts,
  addCommunityPost,
  getCommunityPostComments,
  addCommunityPostComment,
  getMyLikedPostIds,
  toggleCommunityPostLike,
};
