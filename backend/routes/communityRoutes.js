import { Router } from "express";
import {
  getCommunityPosts,
  addCommunityPost,
  getCommunityPostComments,
  addCommunityPostComment,
  getMyLikedPostIds,
  toggleCommunityPostLike,
} from "../controllers/communityController.js";
import { requireAuth } from "../middleware/requireAuth.js";

const communityRouter = Router();

communityRouter.get("/posts", getCommunityPosts);
communityRouter.post("/posts", requireAuth, addCommunityPost);
communityRouter.get("/posts/likes", requireAuth, getMyLikedPostIds);
communityRouter.get("/posts/:id/comments", getCommunityPostComments);
communityRouter.post("/posts/:id/comments", requireAuth, addCommunityPostComment);
communityRouter.post("/posts/:id/likes", requireAuth, toggleCommunityPostLike);

export { communityRouter };
