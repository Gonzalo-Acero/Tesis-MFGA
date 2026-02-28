CREATE TABLE IF NOT EXISTS public."community_post" (
    "PostId" serial PRIMARY KEY,
    "UserId" integer NOT NULL REFERENCES public."user" ("UserId") ON DELETE CASCADE,
    "Category" text NOT NULL,
    "Location" text NOT NULL,
    "Region" text NOT NULL,
    "Message" text NOT NULL,
    "ImageUrl" text,
    "CreatedAt" timestamptz NOT NULL DEFAULT now(),
    "IsActive" boolean NOT NULL DEFAULT true
);

CREATE TABLE IF NOT EXISTS public."community_post_comment" (
    "PostCommentId" serial PRIMARY KEY,
    "PostId" integer NOT NULL REFERENCES public."community_post" ("PostId") ON DELETE CASCADE,
    "UserId" integer NOT NULL REFERENCES public."user" ("UserId") ON DELETE CASCADE,
    "Comment" text NOT NULL,
    "CreatedAt" timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public."community_post_like" (
    "PostLikeId" serial PRIMARY KEY,
    "PostId" integer NOT NULL REFERENCES public."community_post" ("PostId") ON DELETE CASCADE,
    "UserId" integer NOT NULL REFERENCES public."user" ("UserId") ON DELETE CASCADE,
    "CreatedAt" timestamptz NOT NULL DEFAULT now(),
    UNIQUE ("PostId", "UserId")
);

CREATE INDEX IF NOT EXISTS "idx_community_post_createdat"
ON public."community_post" ("CreatedAt" DESC);

CREATE INDEX IF NOT EXISTS "idx_community_post_user_createdat"
ON public."community_post" ("UserId", "CreatedAt" DESC);

CREATE INDEX IF NOT EXISTS "idx_community_post_comment_post_createdat"
ON public."community_post_comment" ("PostId", "CreatedAt" DESC);

CREATE INDEX IF NOT EXISTS "idx_community_post_like_post"
ON public."community_post_like" ("PostId");

