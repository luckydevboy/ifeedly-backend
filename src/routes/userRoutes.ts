import express from "express";

import { getProfile, updateUser } from "../controllers/userController";
import { authenticateToken } from "../middleware";

const router = express.Router();

router.get("/profile", authenticateToken, getProfile);
router.put("/:id", authenticateToken, updateUser);

export default router;
