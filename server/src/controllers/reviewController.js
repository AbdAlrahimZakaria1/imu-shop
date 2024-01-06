import Review from "../models/reviewModel.js";
import * as handlerFactory from "./handlerFactory.js";

export const setProductUserId = (req, res, next) => {
  if (!req.body.productId) req.body.productId = req.params.productId;
  if (!req.body.userId) req.body.userId = req.user.id;
  next();
};

export const createReview = handlerFactory.createOne(Review);
export const getAllReviews = handlerFactory.getAll(Review);
export const getReview = handlerFactory.getOne(Review);
export const updateReview = handlerFactory.updateOne(Review);
export const deleteReview = handlerFactory.deleteOne(Review);
