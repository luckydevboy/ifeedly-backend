import express from "express";
import { getProfile } from "../controllers/userController";
import { authenticateToken } from "../middleware";

const router = express.Router();

router.get("/profile", authenticateToken, getProfile);

export default router;
