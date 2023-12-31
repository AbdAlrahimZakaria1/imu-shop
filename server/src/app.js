import express from "express";
import userRoutes from "./routes/userRoutes.js";
import morgan from "morgan";
import globalErrorController from "./controllers/errorController.js";

const app = express();

app.use(morgan("dev"));

app.use(express.json());

// app.use((req, res, next) => {
//   console.log("hello from middleware");
//   next();
// });

app.use("/api/v1/users", userRoutes);

app.use(globalErrorController);
export default app;
