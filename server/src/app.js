import express from "express";
import userRoutes from "./routes/userRoutes.js";
import morgan from "morgan";
const app = express();

app.use(morgan("dev"));

app.use((req, res, next) => {
  console.log("hello from middleware");
  next();
});

app.use("/api/v1/users", userRoutes);

export default app;
