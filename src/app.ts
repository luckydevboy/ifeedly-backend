import express, { Application } from "express";
import bodyParser from "body-parser";
import morgan from "morgan";
import cors from "cors";

import { postsRoutes, authRoutes, userRoutes, uploadRoutes } from "./routes";

const app: Application = express();

app.use(bodyParser.json());

const corsOptions = {
  origin: ["http://localhost:3000", "https://ifeedly.vercel.app"],
  optionsSuccessStatus: 200,
};

app.use(cors(corsOptions));

if (process.env.NODE_ENV !== "production") {
  app.use(morgan("tiny"));
}

app.use("/posts", postsRoutes);
app.use("/auth", authRoutes);
app.use("/users", userRoutes);
app.use("/upload", uploadRoutes);

export default app;
