import { Request, Response } from "express";
import { v2 as cloudinary } from "cloudinary";

interface MulterRequest extends Request {
  files?: Express.Multer.File[];
}

export const upload = async (req: Request, res: Response) => {
  const multerReq = req as MulterRequest;

  {
    try {
      if (!multerReq.files || multerReq.files.length === 0) {
        return res
          .status(400)
          .json({ status: "error", message: "No file uploaded" });
      }

      const uploadPromises = multerReq.files.map((file) =>
        cloudinary.uploader.upload(file.path),
      );

      const uploadResults = await Promise.all(uploadPromises);
      res.status(201).json({
        status: "success",
        data: uploadResults.map((uploadResult) => ({
          publicId: uploadResult.public_id,
          secureUrl: uploadResult.secure_url,
          format: uploadResult.format,
          resourceType: uploadResult.resource_type,
          bytes: uploadResult.bytes,
          createdAt: uploadResult.created_at,
        })),
      });
    } catch (error) {
      res
        .status(500)
        .json({ status: "error", message: "Internal Server Error" });
    }
  }
};
