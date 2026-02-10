import {
  findAllAttractions,
  findNearbyAttractions,
} from "../models/attractionModel.js";

const parseCoordinate = (value) => {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : null;
};

const getAttractions = async (req, res) => {
  const { category, province, search, limit } = req.query;

  try {
    const attractions = await findAllAttractions({
      category,
      province,
      search,
      limit,
    });
    return res.json(attractions);
  } catch (error) {
    console.error("Error while loading attractions:", error);
    return res.status(500).json({ message: "Internal error while loading attractions" });
  }
};

const getNearbyAttractions = async (req, res) => {
  const { lat, lng, radiusKm, category, province, search, limit } = req.query;

  const latitude = parseCoordinate(lat);
  const longitude = parseCoordinate(lng);

  if (latitude === null || longitude === null) {
    return res.status(400).json({
      message: "lat and lng query params are required and must be valid numbers",
    });
  }

  try {
    const attractions = await findNearbyAttractions({
      latitude,
      longitude,
      radiusKm,
      category,
      province,
      search,
      limit,
    });

    return res.json(attractions);
  } catch (error) {
    console.error("Error while loading nearby attractions:", error);
    return res.status(500).json({
      message: "Internal error while loading nearby attractions",
    });
  }
};

export { getAttractions, getNearbyAttractions };
