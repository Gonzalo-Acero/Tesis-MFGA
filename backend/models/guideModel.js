import { sql } from "../config/ConnectDatabase.js";

const guideSelectableColumns = sql`
  "GuideId",
  "Name",
  "AvatarUrl",
  "IsActive",
  "CreatedAt"
`;

const guideSelectableColumnsFromGuideAlias = sql`
  g."GuideId",
  g."Name",
  g."AvatarUrl",
  g."IsActive",
  g."CreatedAt"
`;

const commentSelectableColumns = sql`
  "GuideCommentId",
  "GuideId",
  "UserId",
  "Comment",
  "CreatedAt"
`;

const commentSelectableColumnsFromGuideCommentAlias = sql`
  gc."GuideCommentId",
  gc."GuideId",
  gc."UserId",
  gc."Comment",
  gc."CreatedAt"
`;

const messageSelectableColumns = sql`
  "GuideMessageId",
  "GuideId",
  "UserId",
  "Message",
  "CreatedAt"
`;

const findAllGuides = async () => {
  return sql`
    SELECT ${guideSelectableColumns}
    FROM public."guide"
    WHERE COALESCE("IsActive", true) = true
    ORDER BY "GuideId" ASC
  `;
};

const findGuideById = async (id) => {
  const [row] = await sql`
    SELECT ${guideSelectableColumns}
    FROM public."guide"
    WHERE "GuideId" = ${id}
    LIMIT 1
  `;
  return row ?? null;
};

const findGuideByName = async (name) => {
  const [row] = await sql`
    SELECT ${guideSelectableColumns}
    FROM public."guide"
    WHERE COALESCE("IsActive", true) = true
      AND LOWER(TRIM("Name")) = LOWER(TRIM(${name}))
    ORDER BY "GuideId" ASC
    LIMIT 1
  `;
  return row ?? null;
};

const findGuideByNameOrAlias = async (name) => {
  try {
    const [row] = await sql`
      SELECT DISTINCT ${guideSelectableColumnsFromGuideAlias}
      FROM public."guide" g
      LEFT JOIN public."guide_alias" ga ON ga."GuideId" = g."GuideId"
      WHERE COALESCE(g."IsActive", true) = true
        AND (
          LOWER(TRIM(g."Name")) = LOWER(TRIM(${name}))
          OR LOWER(TRIM(ga."Alias")) = LOWER(TRIM(${name}))
        )
      ORDER BY g."GuideId" ASC
      LIMIT 1
    `;
    return row ?? null;
  } catch (error) {
    if (error?.code === "42P01") {
      return findGuideByName(name);
    }
    throw error;
  }
};

const findCommentsByGuideId = async (guideId) => {
  return sql`
    SELECT
      ${commentSelectableColumnsFromGuideCommentAlias},
      u."Name" AS "UserName"
    FROM public."guide_comment" gc
    JOIN public."user" u ON u."UserId" = gc."UserId"
    WHERE gc."GuideId" = ${guideId}
    ORDER BY gc."CreatedAt" DESC
  `;
};

const insertGuideComment = async ({ guideId, userId, comment }) => {
  const [row] = await sql`
    INSERT INTO public."guide_comment" ("GuideId", "UserId", "Comment", "CreatedAt")
    VALUES (${guideId}, ${userId}, ${comment}, ${new Date()})
    ON CONFLICT ("GuideId", "UserId")
    DO UPDATE SET
      "Comment" = EXCLUDED."Comment",
      "CreatedAt" = EXCLUDED."CreatedAt"
    RETURNING ${commentSelectableColumns}
  `;
  return row ?? null;
};

const insertGuideMessage = async ({ guideId, userId, message }) => {
  const [row] = await sql`
    INSERT INTO public."guide_message" ("GuideId", "UserId", "Message", "CreatedAt")
    VALUES (${guideId}, ${userId}, ${message}, ${new Date()})
    RETURNING ${messageSelectableColumns}
  `;
  return row ?? null;
};

const upsertGuideRating = async ({ guideId, userId, rating }) => {
  await sql`
    INSERT INTO public."guide_rating" ("GuideId", "UserId", "Rating", "CreatedAt")
    VALUES (${guideId}, ${userId}, ${rating}, ${new Date()})
    ON CONFLICT ("GuideId", "UserId")
    DO UPDATE SET
      "Rating" = EXCLUDED."Rating",
      "CreatedAt" = EXCLUDED."CreatedAt"
  `;
};

const getGuideRatingSummary = async (guideId) => {
  const [row] = await sql`
    SELECT
      AVG("Rating")::float AS "Average",
      COUNT(*)::int AS "Count"
    FROM public."guide_rating"
    WHERE "GuideId" = ${guideId}
  `;
  return row ?? { Average: null, Count: 0 };
};

export {
  findAllGuides,
  findGuideById,
  findGuideByNameOrAlias,
  findCommentsByGuideId,
  insertGuideComment,
  insertGuideMessage,
  upsertGuideRating,
  getGuideRatingSummary,
};
