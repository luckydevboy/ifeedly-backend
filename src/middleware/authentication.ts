import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

interface UserAuthRequest extends Request {
  user?: any;
}

export const authenticateToken = (
  req: UserAuthRequest,
  res: Response,
  next: NextFunction,
) => {
  const token = req.header("Authorization")?.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "Unauthorized!" });
  }

  jwt.verify(token, process.env.SECRET_KEY as string, (err: any, user: any) => {
    if (err) {
      return res.status(403).json({ message: "Wrong token!" });
    }

    req.user = user;
    next();
  });
};
