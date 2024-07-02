import express, { NextFunction, Request, Response } from "express";
import multer from "multer";
import cloudinary from "cloudinary";

import { upload as uploadController } from "../controllers";

const upload = multer({
  dest: "uploads/",
  limits: { fileSize: 10 * 1024 * 1024 }, // 10 MB limit
});
const router = express.Router();

const multerErrorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  if (err instanceof multer.MulterError) {
    if (err.code === "LIMIT_FILE_SIZE") {
      return res.status(400).json({
        status: "fail",
        data: { message: "File size too large. Maximum allowed size is 10MB." },
      });
    }
    return res.status(400).json({
      status: "fail",
      data: { message: "Multer error occurred." },
    });
  }
  next(err);
};

router.post(
  "/",
  upload.array("images", 4),
  multerErrorHandler,
  uploadController,
);

export default router;
