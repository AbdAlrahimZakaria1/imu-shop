import express from "express";
import Review from "../models/reviewModel.js";
import * as handlerFactory from "../controllers/handlerFactory.js";

const router = express.Router();

router
  .route("/")
  .get(handlerFactory.getAll(Review))
  .post(handlerFactory.createOne(Review));

export default router;
