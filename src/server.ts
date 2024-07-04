import "dotenv/config";
import mongoose from "mongoose";

import app from "./app";

process.on("uncaughtException", (err) => {
  console.log("UNCAUGHT EXCEPTION! 💥 Shutting down...");
  console.log(err.name, err.message);
  process.exit(1);
});

mongoose
  .connect(process.env.MONGODB_URI as string)
  .then(() => {
    console.log("Database connected");
  })
  .catch((err) => {
    console.log("Database connection error!", err);
  });

const port = process.env.PORT as string | 3000;

const server = app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

process.on("unhandledRejection", (err: any) => {
  console.log("UNHANDLED REJECTION! 💥 Shutting down...");
  console.log(err.name, err.message);

  server.close(() => {
    process.exit(1);
  });
});

process.on("SIGTERM", () => {
  console.log("👋 SIGTERM RECEIVED. Shutting down gracefully");
  server.close(() => {
    console.log("💥 Process terminated!");
  });
});
