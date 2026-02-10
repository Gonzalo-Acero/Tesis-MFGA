import { Router } from "express";
import {
  getAttractions,
  getNearbyAttractions,
} from "../controllers/attractionController.js";

const attractionRouter = Router();

attractionRouter.get("/", getAttractions);
attractionRouter.get("/nearby", getNearbyAttractions);

export { attractionRouter };
