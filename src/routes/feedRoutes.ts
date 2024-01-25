import express from "express";
import { getFeed, postFeed } from "../controllers";
import { authenticateToken } from "../middleware";

const router = express.Router();

router.get("/", getFeed);
router.post("/", authenticateToken, postFeed);

export default router;
