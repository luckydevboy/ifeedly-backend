import "dotenv/config";
import mongoose from "mongoose";
import fs from "fs/promises";

import { Post, User } from "../models";

async function seedDatabase() {
  try {
    await mongoose.connect(process.env.MONGODB_URI as string);

    console.log("Connected to MongoDB");

    if (process.argv[2] === "--users") {
      await User.collection.drop();

      const file = await fs.readFile(`${__dirname}/users.json`, "utf8");
      const users = JSON.parse(file);

      await User.create(users);
      console.log("Database seeded with users.");
    } else if (process.argv[2] === "--posts") {
      await Post.collection.drop();

      const file = await fs.readFile(`${__dirname}/posts.json`, "utf8");
      const posts = JSON.parse(file);

      await Post.create(posts);
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
