"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const faker_1 = require("@faker-js/faker");
const promises_1 = __importDefault(require("fs/promises"));
const bson_1 = require("bson");
const bcrypt_1 = __importDefault(require("bcrypt"));
if (process.argv[2] === "--posts") {
    promises_1.default.readFile(`${__dirname}/users.json`, "utf8")
        .then((file) => {
        const users = JSON.parse(file);
        const posts = Array.from({ length: 40 }, () => {
            const randomIndex = Math.floor(Math.random() * (users.length - 1));
            return {
                _id: new bson_1.ObjectId(),
                content: faker_1.faker.lorem.paragraph(),
                reactions: {
                    likes: [],
                    comments: [],
                },
                author: users[randomIndex]._id,
            };
        });
        promises_1.default.writeFile(`${__dirname}/posts.json`, JSON.stringify(posts, null, 2), "utf-8")
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
}
else if (process.argv[2] === "--users") {
    const users = Array.from({ length: 4 }, () => ({
        _id: new bson_1.ObjectId(),
        username: faker_1.faker.internet.userName(),
        name: faker_1.faker.person.fullName(),
        password: bcrypt_1.default.hashSync("test1234", 10),
    }));
    promises_1.default.writeFile(`${__dirname}/users.json`, JSON.stringify(users, null, 2), "utf-8")
        .then(() => {
        console.log("Faker users generated successfully.");
    })
        .catch((err) => {
        console.log(err);
    });
}
