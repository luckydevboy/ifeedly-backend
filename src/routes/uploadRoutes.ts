import express from "express";

import { upload as uploadController } from "../controllers";
import { authenticateToken, multerErrorHandler, upload } from "../middleware";

const router = express.Router();

router.post(
  "/",
  authenticateToken,
  upload.array("images", 4),
  multerErrorHandler,
  uploadController,
);

export default router;
