import "dotenv/config";
import express, { Application } from "express";
import bodyParser from "body-parser";
import morgan from "morgan";
import cors from "cors";
import mongoose from "mongoose";
import { postsRoutes, authRoutes } from "./routes";

const app: Application = express();
const port: number = 3001;

app.use(bodyParser.json());

const corsOptions = {
  origin: "http://localhost:3000",
  optionsSuccessStatus: 200,
};

app.use(cors(corsOptions));
app.use(morgan("tiny"));

app.use("/posts", postsRoutes);
app.use("/auth", authRoutes);

mongoose.connect("mongodb://localhost:27017/ifeedly").then(() => {
  console.log("Database connected");
  app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  });
});