CREATE TABLE IF NOT EXISTS public."guide" (
    "GuideId" serial PRIMARY KEY,
    "Name" text NOT NULL,
    "AvatarUrl" text,
    "IsActive" boolean NOT NULL DEFAULT true,
    "CreatedAt" timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public."guide_comment" (
    "GuideCommentId" serial PRIMARY KEY,
    "GuideId" integer NOT NULL REFERENCES public."guide" ("GuideId") ON DELETE CASCADE,
    "UserId" integer NOT NULL REFERENCES public."user" ("UserId") ON DELETE CASCADE,
    "Comment" text NOT NULL,
    "CreatedAt" timestamptz NOT NULL DEFAULT now(),
    UNIQUE ("GuideId", "UserId")
);

CREATE TABLE IF NOT EXISTS public."guide_rating" (
    "GuideRatingId" serial PRIMARY KEY,
    "GuideId" integer NOT NULL REFERENCES public."guide" ("GuideId") ON DELETE CASCADE,
    "UserId" integer NOT NULL REFERENCES public."user" ("UserId") ON DELETE CASCADE,
    "Rating" integer NOT NULL CHECK ("Rating" >= 1 AND "Rating" <= 5),
    "CreatedAt" timestamptz NOT NULL DEFAULT now(),
    UNIQUE ("GuideId", "UserId")
);

CREATE TABLE IF NOT EXISTS public."guide_message" (
    "GuideMessageId" serial PRIMARY KEY,
    "GuideId" integer NOT NULL REFERENCES public."guide" ("GuideId") ON DELETE CASCADE,
    "UserId" integer NOT NULL REFERENCES public."user" ("UserId") ON DELETE CASCADE,
    "Message" text NOT NULL,
    "CreatedAt" timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS "idx_guide_comment_guide_createdat" ON public."guide_comment" ("GuideId", "CreatedAt" DESC);
CREATE INDEX IF NOT EXISTS "idx_guide_rating_guide" ON public."guide_rating" ("GuideId");
CREATE INDEX IF NOT EXISTS "idx_guide_message_guide_createdat" ON public."guide_message" ("GuideId", "CreatedAt" DESC);
