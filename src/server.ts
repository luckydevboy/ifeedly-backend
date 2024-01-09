import express, { Application, Request, Response } from "express";
import bodyParser from "body-parser";
import fs from "fs/promises";

interface Post {}
interface User {}

const app: Application = express();
const port: number = 3000;

app.use(bodyParser.json());

app.get("/posts", async (req: Request, res: Response) => {
  const file = await fs.readFile(`${__dirname}/data/posts.json`, "utf-8");
  const data = JSON.parse(file);

  res.json(data);
});

app.get("/users", async (req: Request, res: Response) => {
  const file = await fs.readFile(`${__dirname}/data/users.json`, "utf-8");
  const data = JSON.parse(file);

  res.json(data);
});

app.post("/posts", (req: Request, res: Response) => {});

async function startServer(): Promise<void> {
  app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
  });
}

startServer();
