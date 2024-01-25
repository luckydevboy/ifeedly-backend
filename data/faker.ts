import { faker } from "@faker-js/faker";
import { v4 as uuidv4 } from "uuid";
import { Post, User } from "../src/models";
import fs from "fs/promises";

const generateUser = (): User => ({
  id: uuidv4(),
  username: faker.internet.userName(),
  password: faker.internet.password(),
  name: faker.person.fullName(),
  created_time: faker.date.past().toISOString(),
});

const generatePost = (user: User): Post => ({
  content: faker.lorem.paragraph(),
  id: uuidv4(),
  created_time: faker.date.past().toISOString(),
  reactions: {
    likes: faker.number.int({ min: 0, max: 100 }),
    comments: faker.number.int({ min: 0, max: 100 }),
  },
  user: {
    id: user.id,
    username: user.username,
    name: user.name,
  },
});

const users: User[] = Array.from({ length: 3 }, () => generateUser());

// Generate 4 posts for each user
const feed: Post[] = users.flatMap((user) =>
  Array.from({ length: 4 }, () => generatePost(user)),
);

fs.writeFile(`${__dirname}/feed.json`, JSON.stringify(feed, null, 2), "utf-8");

fs.writeFile(
  `${__dirname}/users.json`,
  JSON.stringify(users, null, 2),
  "utf-8",
);
