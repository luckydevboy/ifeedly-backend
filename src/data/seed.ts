import mongoose from "mongoose";
import fs from "fs/promises";
import { PostModel, UserModel } from "../models";

const mongoURI = "mongodb://localhost:27017/ifeedly";

async function seedDatabase() {
  try {
    await mongoose.connect(mongoURI);

    console.log("Connected to MongoDB");

    if (process.argv[2] === "--users") {
      await UserModel.collection.drop();

      const file = await fs.readFile(`${__dirname}/users.json`, "utf8");
      const users = JSON.parse(file);

      await UserModel.create(users);
      console.log("Database seeded with users.");
    } else if (process.argv[2] === "--posts") {
      await PostModel.collection.drop();

      const file = await fs.readFile(`${__dirname}/posts.json`, "utf8");
      const posts = JSON.parse(file);

      await PostModel.create(posts);
      console.log("Database seeded with posts.");
    }
  } catch (error) {
    console.error("Error seeding database:", error);
  } finally {
    await mongoose.connection.close();
    console.log("MongoDB connection closed");
  }
}

seedDatabase();
