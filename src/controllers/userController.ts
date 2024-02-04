import { Request, Response } from "express";
import { UserModel } from "../models";
import jwt, { JwtPayload } from "jsonwebtoken";

export const getProfile = async (req: Request, res: Response) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    const decoded = token ? (jwt.decode(token) as JwtPayload) : null;
    const user = await UserModel.findOne({ _id: decoded?.id }).select(
      "-password",
    );

    res.json({
      status: "success",
      data: {
        user,
      },
    });
  } catch (error) {
    console.error("Error fetching feed:", error);
    res.status(500).json({ status: "error", message: "Internal Server Error" });
  }
};
