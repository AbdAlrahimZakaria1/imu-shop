import express from "express";
import morgan from "morgan";

import AppError from "./utils/appError.js";
import userRoutes from "./routes/userRoutes.js";
import productRoutes from "./routes/productRoutes.js";
import globalErrorController from "./controllers/errorController.js";

const app = express();

app.use(morgan("dev"));

app.use(express.json());

// app.use((req, res, next) => {
//   console.log("hello from middleware");
//   next();
// });

app.use("/api/v1/users", userRoutes);
app.use("/api/v1/products", productRoutes);

app.all("*", (req, res, next) => {
  next(new AppError(`Can't find route ${req.originalUrl} on the server!`, 404));
});

app.use(globalErrorController);

export default app;
