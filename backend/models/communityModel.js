import { sql } from "../config/ConnectDatabase.js";

const postSelectableColumnsFromAlias = sql`
  cp."PostId",
  cp."UserId",
  cp."Category",
  cp."Location",
  cp."Region",
  cp."Message",
  cp."ImageUrl",
  cp."CreatedAt"
`;

const commentSelectableColumnsFromAlias = sql`
  c."PostCommentId",
  c."PostId",
  c."UserId",
  c."Comment",
  c."CreatedAt"
`;

const normalizeLimit = (value, fallback = 100, max = 300) => {
  const parsed = Number(value);
  if (!Number.isFinite(parsed) || parsed <= 0) return fallback;
  return Math.min(parsed, max);
};

const buildPostCountJoin = () => sql`
  LEFT JOIN (
    SELECT "PostId", COUNT(*)::int AS "LikeCount"
    FROM public."community_post_like"
    GROUP BY "PostId"
  ) pl ON pl."PostId" = cp."PostId"
  LEFT JOIN (
    SELECT "PostId", COUNT(*)::int AS "CommentCount"
    FROM public."community_post_comment"
    GROUP BY "PostId"
  ) pc ON pc."PostId" = cp."PostId"
`;

const findAllCommunityPosts = async ({ limit } = {}) => {
  const safeLimit = normalizeLimit(limit);
  const postCountJoin = buildPostCountJoin();

  return sql`
    SELECT
      ${postSelectableColumnsFromAlias},
      u."Name" AS "AuthorName",
      COALESCE(pl."LikeCount", 0)::int AS "LikeCount",
      COALESCE(pc."CommentCount", 0)::int AS "CommentCount"
    FROM public."community_post" cp
    JOIN public."user" u ON u."UserId" = cp."UserId"
    ${postCountJoin}
    WHERE COALESCE(cp."IsActive", true) = true
    ORDER BY cp."CreatedAt" DESC, cp."PostId" DESC
    LIMIT ${safeLimit}
  `;
};

const findCommunityPostById = async (postId) => {
  const postCountJoin = buildPostCountJoin();
  const [row] = await sql`
    SELECT
      ${postSelectableColumnsFromAlias},
      u."Name" AS "AuthorName",
      COALESCE(pl."LikeCount", 0)::int AS "LikeCount",
      COALESCE(pc."CommentCount", 0)::int AS "CommentCount"
    FROM public."community_post" cp
    JOIN public."user" u ON u."UserId" = cp."UserId"
    ${postCountJoin}
    WHERE cp."PostId" = ${postId}
      AND COALESCE(cp."IsActive", true) = true
    LIMIT 1
  `;
  return row ?? null;
};

const insertCommunityPost = async ({
  userId,
  category,
  location,
  region,
  message,
  imageUrl = null,
}) => {
  const [row] = await sql`
    INSERT INTO public."community_post" (
      "UserId",
      "Category",
      "Location",
      "Region",
      "Message",
      "ImageUrl",
      "CreatedAt",
      "IsActive"
    )
    VALUES (
      ${userId},
      ${category},
      ${location},
      ${region},
      ${message},
      ${imageUrl},
      ${new Date()},
      true
    )
    RETURNING "PostId"
  `;

  if (!row?.PostId) return null;
  return findCommunityPostById(row.PostId);
};

const findCommentsByPostId = async (postId, { limit } = {}) => {
  const safeLimit = normalizeLimit(limit, 100, 500);
  return sql`
    SELECT
      ${commentSelectableColumnsFromAlias},
      u."Name" AS "UserName"
    FROM public."community_post_comment" c
    JOIN public."user" u ON u."UserId" = c."UserId"
    WHERE c."PostId" = ${postId}
    ORDER BY c."CreatedAt" DESC, c."PostCommentId" DESC
    LIMIT ${safeLimit}
  `;
};

const insertCommunityPostComment = async ({ postId, userId, comment }) => {
  const [row] = await sql`
    INSERT INTO public."community_post_comment" (
      "PostId",
      "UserId",
      "Comment",
      "CreatedAt"
    )
    VALUES (
      ${postId},
      ${userId},
      ${comment},
      ${new Date()}
    )
    RETURNING "PostCommentId"
  `;

  if (!row?.PostCommentId) return null;

  const [commentRow] = await sql`
    SELECT
      ${commentSelectableColumnsFromAlias},
      u."Name" AS "UserName"
    FROM public."community_post_comment" c
    JOIN public."user" u ON u."UserId" = c."UserId"
    WHERE c."PostCommentId" = ${row.PostCommentId}
    LIMIT 1
  `;

  return commentRow ?? null;
};

const countCommentsByPostId = async (postId) => {
  const [row] = await sql`
    SELECT COUNT(*)::int AS "Count"
    FROM public."community_post_comment"
    WHERE "PostId" = ${postId}
  `;
  return Number(row?.Count ?? 0);
};

const findLikedPostIdsByUserId = async (userId) => {
  const rows = await sql`
    SELECT "PostId"
    FROM public."community_post_like"
    WHERE "UserId" = ${userId}
  `;

  return rows
    .map((row) => Number(row?.PostId))
    .filter((value) => Number.isFinite(value));
};

const hasUserLikedPost = async ({ postId, userId }) => {
  const [row] = await sql`
    SELECT 1
    FROM public."community_post_like"
    WHERE "PostId" = ${postId}
      AND "UserId" = ${userId}
    LIMIT 1
  `;
  return Boolean(row);
};

const insertCommunityPostLike = async ({ postId, userId }) => {
  await sql`
    INSERT INTO public."community_post_like" ("PostId", "UserId", "CreatedAt")
    VALUES (${postId}, ${userId}, ${new Date()})
    ON CONFLICT ("PostId", "UserId")
    DO NOTHING
  `;
};

const deleteCommunityPostLike = async ({ postId, userId }) => {
  await sql`
    DELETE FROM public."community_post_like"
    WHERE "PostId" = ${postId}
      AND "UserId" = ${userId}
  `;
};

const countLikesByPostId = async (postId) => {
  const [row] = await sql`
    SELECT COUNT(*)::int AS "Count"
    FROM public."community_post_like"
    WHERE "PostId" = ${postId}
  `;
  return Number(row?.Count ?? 0);
};

export {
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
};
