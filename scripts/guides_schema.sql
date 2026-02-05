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
    "CreatedAt" timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public."guide_rating" (
    "GuideRatingId" serial PRIMARY KEY,
    "GuideId" integer NOT NULL REFERENCES public."guide" ("GuideId") ON DELETE CASCADE,
    "UserId" integer NOT NULL REFERENCES public."user" ("UserId") ON DELETE CASCADE,
    "Rating" integer NOT NULL CHECK ("Rating" >= 1 AND "Rating" <= 5),
    "CreatedAt" timestamptz NOT NULL DEFAULT now(),
    UNIQUE ("GuideId", "UserId")
);
