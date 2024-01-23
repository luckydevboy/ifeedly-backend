import { Request, Response } from "express";
import { validationResult } from "express-validator";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { User } from "../models";
import fs from "fs/promises";
import { v4 as uuidv4 } from "uuid";

export const registerUser = async (req: Request, res: Response) => {
  const file = await fs.readFile(`${__dirname}/../../data/users.json`, "utf-8");
  const users: User[] = JSON.parse(file);

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { username, password, name } = req.body;

  if (users.some((user) => user.username === username)) {
    return res.status(400).json({ error: "User already exists" });
  }

  const hashedPassword = bcrypt.hashSync(password, 10);
  users.push({
    username: String(username),
    password: hashedPassword,
    id: uuidv4(),
    created_time: new Date().toISOString(),
    name,
  });

  await fs.writeFile(
    `${__dirname}/../../data/users.json`,
    JSON.stringify(users),
    "utf8",
  );

  const token = jwt.sign({ username }, process.env.SECRET_KEY as string);

  return res.status(201).json({ username, token });
};

export const loginUser = async (req: Request, res: Response) => {
  const file = await fs.readFile(`${__dirname}/../../data/users.json`, "utf-8");
  const users: User[] = JSON.parse(file);

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { username, password } = req.body;

  const user = users.find((user) => user.username === username);

  if (!user || !bcrypt.compareSync(password, user.password)) {
    return res.status(401).json({ error: "Invalid credentials" });
  }

  const token = jwt.sign({ username }, process.env.SECRET_KEY as string);

  return res.json({ username, token });
};
