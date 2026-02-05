import { sql } from "../config/ConnectDatabase.js";

const guideSelectableColumns = sql`
  "GuideId",
  "Name",
  "AvatarUrl",
  "IsActive",
  "CreatedAt"
`;

const commentSelectableColumns = sql`
  "GuideCommentId",
  "GuideId",
  "UserId",
  "Comment",
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

const findCommentsByGuideId = async (guideId) => {
  return sql`
    SELECT
      ${commentSelectableColumns},
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
    RETURNING ${commentSelectableColumns}
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
  findCommentsByGuideId,
  insertGuideComment,
  upsertGuideRating,
  getGuideRatingSummary,
};
