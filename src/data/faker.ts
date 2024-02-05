import { faker } from "@faker-js/faker";
import fs from "fs/promises";
import { ObjectId } from "bson";
import bcrypt from "bcrypt";
import { IUser } from "../interfaces";

if (process.argv[2] === "--posts") {
  fs.readFile(`${__dirname}/users.json`, "utf8")
    .then((file) => {
      const users: IUser[] = JSON.parse(file);

      const posts = Array.from({ length: Number(process.argv[3]) }, () => {
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
  const users = Array.from({ length: Number(process.argv[3]) }, () => ({
    _id: new ObjectId(),
    username: faker.internet.userName(),
    name: faker.person.fullName(),
    image: faker.image.avatar(),
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
