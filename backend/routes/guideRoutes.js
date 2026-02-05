import { Router } from "express";
import {
  getGuides,
  getGuideById,
  getGuideComments,
  addGuideComment,
  addGuideRating,
  sendGuideMessage,
} from "../controllers/guideController.js";
import { requireAuth } from "../middleware/requireAuth.js";

const guideRouter = Router();

guideRouter.get("/", getGuides);
guideRouter.get("/:id", getGuideById);
guideRouter.get("/:id/comments", getGuideComments);

guideRouter.post("/:id/comments", requireAuth, addGuideComment);
guideRouter.post("/:id/ratings", requireAuth, addGuideRating);
guideRouter.post("/:id/messages", requireAuth, sendGuideMessage);

export { guideRouter };
