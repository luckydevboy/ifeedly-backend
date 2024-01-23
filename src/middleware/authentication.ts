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
    return res.sendStatus(401);
  }

  jwt.verify(token, process.env.SECRET_KEY as string, (err: any, user: any) => {
    if (err) {
      return res.sendStatus(403);
    }

    req.user = user;
    next();
  });
};
