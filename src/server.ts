import "dotenv/config";
import express, {Application, NextFunction, Request, Response} from "express";
import bodyParser from "body-parser";
import fs from "fs/promises";
import morgan from "morgan";
import cors from "cors";
import { v4 as uuidv4 } from "uuid";
import { Post, User } from "./lib/definitions";
import { body, validationResult } from "express-validator";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const app: Application = express();
const port: number = 3001;

app.use(bodyParser.json());

const corsOptions = {
  origin: "http://localhost:3000",
  optionsSuccessStatus: 200,
};

app.use(cors(corsOptions));
app.use(morgan("tiny"));

let feed: Post[] = [];
let users: User[] = [];

interface UserAuthRequest extends Request {
    user?: any;
}

async function readUsersFromFile() {
  try {
    const feedFileContent = await fs.readFile(
      `${__dirname}/data/feed.json`,
      "utf-8",
    );
    feed = JSON.parse(feedFileContent);
  } catch (error: any) {
    console.error("Error reading users.json file:", error.message);
  }
}

async function writeUsersToFile() {
  try {
    await fs.writeFile(
      `${__dirname}/data/users.json`,
      JSON.stringify(users, null, 2),
      "utf-8",
    );
  } catch (error: any) {
    console.error("Error writing to users.json file:", error.message);
  }
}

app.get("/feed", async (req: Request, res: Response) => {
  const file = await fs.readFile(`${__dirname}/data/feed.json`, "utf-8");
  const data: Post[] = JSON.parse(file);

  res.json(
    data.sort(
      (a, b) =>
        new Date(b.created_time).getTime() - new Date(a.created_time).getTime(),
    ),
  );
});

app.post("/feed", async (req: Request, res: Response) => {
  const file = await fs.readFile(`${__dirname}/data/feed.json`, "utf-8");
  const data = JSON.parse(file);
  data.push({
    content: req.body.content,
    id: uuidv4(),
    created_time: new Date().toISOString(),
    author: "John Doe",
    reactions: { likes: 0, comments: 0 },
    username: "john@doe",
  });

  fs.writeFile(
    `${__dirname}/data/feed.json`,
    JSON.stringify(data, null, 2),
    "utf-8",
  );

  res.status(201).json(req.body);
});

const authenticateToken = (
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

app.post(
  "/register",
  [body("username").notEmpty(), body("password").notEmpty()],
  async (req: Request, res: Response) => {
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

    await writeUsersToFile();

    const token = jwt.sign({ username }, process.env.SECRET_KEY as string);

    return res.status(201).json({ username, token });
  },
);

app.post(
  "/login",
  [body("username").notEmpty(), body("password").notEmpty()],
  (req: Request, res: Response) => {
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
  },
);

readUsersFromFile().then(() => {
  app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  });
});
