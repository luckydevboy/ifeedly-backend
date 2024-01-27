import { faker } from "@faker-js/faker";
import { User } from "../models";
import fs from "fs/promises";
import { ObjectId } from "bson";
import bcrypt from "bcrypt";

if (process.argv[2] === "--posts") {
  fs.readFile(`${__dirname}/users.json`, "utf8")
    .then((file) => {
      const users: User[] = JSON.parse(file);

      const posts = Array.from({ length: 40 }, () => {
        const randomIndex = Math.floor(Math.random() * (users.length - 1));
        return {
          _id: new ObjectId(),
          content: faker.lorem.paragraph(),
          reactions: {
            likes: [],
            comments: [],
          },
          author: users[randomIndex]._id,
        };
      });

      fs.writeFile(
        `${__dirname}/posts.json`,
        JSON.stringify(posts, null, 2),
        "utf-8",
      )
        .then(() => {
          console.log("Faker posts generated successfully.");
        })
        .catch((err) => {
          console.log(err);
        });
    })
    .catch((err) => {
      console.log(err);
    });
} else if (process.argv[2] === "--users") {
  const users = Array.from({ length: 4 }, () => ({
    _id: new ObjectId(),
    username: faker.internet.userName(),
    name: faker.person.fullName(),
    password: bcrypt.hashSync("test1234", 10),
  }));

  fs.writeFile(
    `${__dirname}/users.json`,
    JSON.stringify(users, null, 2),
    "utf-8",
  )
    .then(() => {
      console.log("Faker users generated successfully.");
    })
    .catch((err) => {
      console.log(err);
    });
}
