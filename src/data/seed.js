"use strict";
var __awaiter =
  (this && this.__awaiter) ||
  function (thisArg, _arguments, P, generator) {
    function adopt(value) {
      return value instanceof P
        ? value
        : new P(function (resolve) {
            resolve(value);
          });
    }
    return new (P || (P = Promise))(function (resolve, reject) {
      function fulfilled(value) {
        try {
          step(generator.next(value));
        } catch (e) {
          reject(e);
        }
      }
      function rejected(value) {
        try {
          step(generator["throw"](value));
        } catch (e) {
          reject(e);
        }
      }
      function step(result) {
        result.done
          ? resolve(result.value)
          : adopt(result.value).then(fulfilled, rejected);
      }
      step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
  };
var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod };
  };
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const promises_1 = __importDefault(require("fs/promises"));
const models_1 = require("../models");
const mongoURI = "mongodb://localhost:27017/ifeedly";
function seedDatabase() {
  return __awaiter(this, void 0, void 0, function* () {
    try {
      yield mongoose_1.default.connect(mongoURI);
      console.log("Connected to MongoDB");
      yield models_1.PostModel.collection.drop();
      if (process.argv[2] === "--users") {
        const file = yield promises_1.default.readFile(
          `${__dirname}/users.json`,
          "utf8",
        );
        const users = JSON.parse(file);
        yield models_1.UserModel.create(users);
        console.log("Database seeded with users.");
      } else if (process.argv[2] === "--posts") {
        const file = yield promises_1.default.readFile(
          `${__dirname}/posts.json`,
          "utf8",
        );
        const posts = JSON.parse(file);
        yield models_1.PostModel.create(posts);
        console.log("Database seeded with posts.");
      }
    } catch (error) {
      console.error("Error seeding database:", error);
    } finally {
      yield mongoose_1.default.connection.close();
      console.log("MongoDB connection closed");
    }
  });
}
seedDatabase();
