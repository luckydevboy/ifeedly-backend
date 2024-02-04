import express from "express";
import { getProfile } from "../controllers/userController";

const router = express.Router();

router.get("/profile", getProfile);

export default router;
