import express, { Application, Request, Response } from "express";
import bodyParser from "body-parser";
import fs from "fs/promises";
import morgan from "morgan";
import cors from "cors";
import { v4 as uuidv4 } from "uuid";
import { Post } from "./lib/definitions";

const app: Application = express();
const port: number = 3001;

app.use(bodyParser.json());

const corsOptions = {
  origin: "http://localhost:3000",
  optionsSuccessStatus: 200,
};

app.use(cors(corsOptions));
app.use(morgan("tiny"));

let feed = [];

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

readUsersFromFile().then(() => {
  app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  });
});
