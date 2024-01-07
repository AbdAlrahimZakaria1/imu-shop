// TODO change all this to imports & change paths
import fs from "fs";
import mongoose from "mongoose";
import dotenv from "dotenv";
import Product from "../models/productModel.js";
import User from "../models/userModel.js";
import Review from "../models/reviewModel.js";
import { fileURLToPath } from "url";
import { dirname } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config({ path: "./config.env" });

const DB = process.env.DATABASE.replace(
  "<PASSWORD>",
  process.env.DATABASE_PASSWORD
);

mongoose.connect(DB).then(() => {
  console.log("Connection to DB has been established!");
});

const importData = async () => {
  try {
    const product = await JSON.parse(
      fs.readFileSync(`${__dirname}/data/products.json`, "utf-8")
    );
    const users = await JSON.parse(
      fs.readFileSync(`${__dirname}/data/users.json`, "utf-8")
    );
    // const reviews = await JSON.parse(
    //   fs.readFileSync(`${__dirname}/data/reviews.json`, "utf-8")
    // );
    await Product.create(product);
    await User.create(users);
    // await Review.create(reviews);
    console.log("Data has been successfully imported!");
  } catch (err) {
    console.log(err);
  }
  process.exit();
};

const deleteData = async () => {
  try {
    await Product.deleteMany();
    await User.deleteMany();
    await Review.deleteMany();
    console.log("Data has been successfully deleted!");
  } catch (err) {
    console.log(err);
  }
  process.exit();
};

if (process.argv[2] === "--import") {
  importData();
} else if (process.argv[2] === "--delete") {
  deleteData();
}
