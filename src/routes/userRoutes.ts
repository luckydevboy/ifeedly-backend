import express from "express";
import { getProfile } from "../controllers/user";
import { authenticateToken } from "../middleware";

const router = express.Router();

router.get("/profile", authenticateToken, getProfile);

export default router;
