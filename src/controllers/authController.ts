import { Request, Response } from "express";
import { validationResult } from "express-validator";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { User, UserModel } from "../models";
import fs from "fs/promises";

export const registerUser = async (req: Request, res: Response) => {
  const file = await fs.readFile(`${__dirname}/../../data/users.json`, "utf-8");
  const users: User[] = JSON.parse(file);

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { username, password, name } = req.body;

  if (users.some((user) => user.username === username)) {
    return res.status(400).json({ message: "User already exists" });
  }

  const hashedPassword = bcrypt.hashSync(password, 10);

  const user = await UserModel.create({
    username,
    password: hashedPassword,
    name,
  });

  const token = jwt.sign({ id: user._id }, process.env.SECRET_KEY as string);

  return res.status(201).json({ status: "success", data: { user, token } });
};

export const loginUser = async (req: Request, res: Response) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { username, password } = req.body;

    const user = await UserModel.findOne({ username });

    if (!user || !bcrypt.compareSync(password, user.password)) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign({ id: user._id }, process.env.SECRET_KEY as string);

    return res.json({ status: "success", data: { username, token } });
  } catch (error) {
    console.error("Error during login:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};
