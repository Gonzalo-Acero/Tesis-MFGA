CREATE TABLE IF NOT EXISTS public."attraction" (
    "AttractionId" serial PRIMARY KEY,
    "Name" text NOT NULL,
    "Description" text NOT NULL,
    "Category" text NOT NULL,
    "Province" text NOT NULL,
    "ImageUrl" text,
    "Latitude" double precision NOT NULL,
    "Longitude" double precision NOT NULL,
    "DistanceKm" double precision,
    "Rating" numeric(2, 1) NOT NULL DEFAULT 4.5 CHECK ("Rating" >= 0 AND "Rating" <= 5),
    "IsActive" boolean NOT NULL DEFAULT true,
    "CreatedAt" timestamptz NOT NULL DEFAULT now()
);

CREATE UNIQUE INDEX IF NOT EXISTS "idx_attraction_name_unique"
    ON public."attraction" ("Name");

CREATE INDEX IF NOT EXISTS "idx_attraction_active"
    ON public."attraction" ("IsActive");

CREATE INDEX IF NOT EXISTS "idx_attraction_category"
    ON public."attraction" ("Category");

CREATE INDEX IF NOT EXISTS "idx_attraction_province"
    ON public."attraction" ("Province");

CREATE INDEX IF NOT EXISTS "idx_attraction_coordinates"
    ON public."attraction" ("Latitude", "Longitude");
