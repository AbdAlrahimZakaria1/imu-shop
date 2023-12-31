import mongoose from "mongoose";
import app from "./app.js";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, "../config.env") });

mongoose.connect(process.env.DATABASE).then(() => {
  console.log("connection to the DB has ben established");
});

app.listen(3000, () => {
  console.log("Listening on port 3000!");
});
