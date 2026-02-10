import { sql } from "../config/ConnectDatabase.js";

const attractionSelectableColumns = sql`
  "AttractionId",
  "Name",
  "Description",
  "Category",
  "Province",
  "ImageUrl",
  "Latitude",
  "Longitude",
  "DistanceKm",
  "Rating",
  "IsActive",
  "CreatedAt"
`;

const normalizeLimit = (value, fallback = 100) => {
  const parsed = Number(value);
  if (!Number.isFinite(parsed) || parsed <= 0) return fallback;
  return Math.min(parsed, 500);
};

const normalizeRadius = (value) => {
  if (value === undefined || value === null || value === "") return null;
  const parsed = Number(value);
  if (!Number.isFinite(parsed) || parsed <= 0) return null;
  return parsed;
};

const normalizeText = (value) => {
  if (typeof value !== "string") return "";
  return value.trim();
};

const buildCommonFilters = ({ category, province, search }) => {
  const normalizedCategory = normalizeText(category);
  const normalizedProvince = normalizeText(province);
  const normalizedSearch = normalizeText(search);

  const searchPattern = normalizedSearch ? `%${normalizedSearch}%` : "";

  return sql`
    WHERE COALESCE("IsActive", true) = true
    ${
      normalizedCategory && normalizedCategory.toLowerCase() !== "all"
        ? sql`AND LOWER("Category") = LOWER(${normalizedCategory})`
        : sql``
    }
    ${
      normalizedProvince && normalizedProvince !== "All Provinces"
        ? sql`AND "Province" = ${normalizedProvince}`
        : sql``
    }
    ${
      normalizedSearch
        ? sql`AND (
            "Name" ILIKE ${searchPattern}
            OR "Description" ILIKE ${searchPattern}
            OR "Province" ILIKE ${searchPattern}
          )`
        : sql``
    }
  `;
};

const findAllAttractions = async ({ category, province, search, limit }) => {
  const safeLimit = normalizeLimit(limit);
  const filters = buildCommonFilters({ category, province, search });

  return sql`
    SELECT ${attractionSelectableColumns}
    FROM public."attraction"
    ${filters}
    ORDER BY "Rating" DESC, "Name" ASC
    LIMIT ${safeLimit}
  `;
};

const findNearbyAttractions = async ({
  latitude,
  longitude,
  radiusKm,
  category,
  province,
  search,
  limit,
}) => {
  const safeLimit = normalizeLimit(limit);
  const safeRadius = normalizeRadius(radiusKm);
  const filters = buildCommonFilters({ category, province, search });

  const distanceExpression = sql`
    (
      6371 * acos(
        LEAST(
          1,
          GREATEST(
            -1,
            cos(radians(${latitude})) * cos(radians("Latitude")) *
            cos(radians("Longitude") - radians(${longitude})) +
            sin(radians(${latitude})) * sin(radians("Latitude"))
          )
        )
      )
    )
  `;

  return sql`
    WITH ranked AS (
      SELECT
        ${attractionSelectableColumns},
        ${distanceExpression} AS "ComputedDistanceKm"
      FROM public."attraction"
      ${filters}
    )
    SELECT *
    FROM ranked
    ${safeRadius !== null ? sql`WHERE "ComputedDistanceKm" <= ${safeRadius}` : sql``}
    ORDER BY "ComputedDistanceKm" ASC, "Rating" DESC, "Name" ASC
    LIMIT ${safeLimit}
  `;
};

export { findAllAttractions, findNearbyAttractions };
