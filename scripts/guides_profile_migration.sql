-- Migration for guide profile interactions:
-- 1) Enforce one comment per user per guide.
-- 2) Enforce one rating per user per guide.
-- 3) Create persistent guide messages table.

CREATE TABLE IF NOT EXISTS public."guide_message" (
    "GuideMessageId" serial PRIMARY KEY,
    "GuideId" integer NOT NULL REFERENCES public."guide" ("GuideId") ON DELETE CASCADE,
    "UserId" integer NOT NULL REFERENCES public."user" ("UserId") ON DELETE CASCADE,
    "Message" text NOT NULL,
    "CreatedAt" timestamptz NOT NULL DEFAULT now()
);

-- Keep only the latest comment per (GuideId, UserId).
WITH ranked_comments AS (
    SELECT
        "GuideCommentId",
        ROW_NUMBER() OVER (
            PARTITION BY "GuideId", "UserId"
            ORDER BY "CreatedAt" DESC, "GuideCommentId" DESC
        ) AS rn
    FROM public."guide_comment"
)
DELETE FROM public."guide_comment" gc
USING ranked_comments rc
WHERE gc."GuideCommentId" = rc."GuideCommentId"
  AND rc.rn > 1;

-- Keep only the latest rating per (GuideId, UserId).
WITH ranked_ratings AS (
    SELECT
        "GuideRatingId",
        ROW_NUMBER() OVER (
            PARTITION BY "GuideId", "UserId"
            ORDER BY "CreatedAt" DESC, "GuideRatingId" DESC
        ) AS rn
    FROM public."guide_rating"
)
DELETE FROM public."guide_rating" gr
USING ranked_ratings rr
WHERE gr."GuideRatingId" = rr."GuideRatingId"
  AND rr.rn > 1;

CREATE UNIQUE INDEX IF NOT EXISTS "ux_guide_comment_guide_user"
ON public."guide_comment" ("GuideId", "UserId");

CREATE UNIQUE INDEX IF NOT EXISTS "ux_guide_rating_guide_user"
ON public."guide_rating" ("GuideId", "UserId");

CREATE INDEX IF NOT EXISTS "idx_guide_comment_guide_createdat"
ON public."guide_comment" ("GuideId", "CreatedAt" DESC);

CREATE INDEX IF NOT EXISTS "idx_guide_rating_guide"
ON public."guide_rating" ("GuideId");

CREATE INDEX IF NOT EXISTS "idx_guide_message_guide_createdat"
ON public."guide_message" ("GuideId", "CreatedAt" DESC);
