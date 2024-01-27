import express from "express";
import { createPost, getPosts, likePost } from "../controllers";
import { authenticateToken } from "../middleware";

const router = express.Router();

router.get("/", getPosts);
router.post("/", authenticateToken, createPost);
router.put("/like/:postId", authenticateToken, likePost);

export default router;
