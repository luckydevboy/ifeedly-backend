import express from "express";
import { getFeed, postToFeed } from "../controllers";

const router = express.Router();

router.get("/", getFeed);
router.post("/", postToFeed);

export default router;
