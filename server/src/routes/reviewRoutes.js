import express from "express";
import * as reviewController from "../controllers/reviewController.js";
import * as authController from "../controllers/authController.js";

const router = express.Router({ mergeParams: true });

router.use(authController.protect);
router
  .route("/")
  // get all reviews on specific product - TBC after applying filters
  .get(reviewController.getAllReviews)
  .post(reviewController.setProductUserId, reviewController.createReview);

router
  .route("/:id")
  .get(reviewController.getReview)
  .patch(reviewController.updateReview)
  .delete(reviewController.deleteReview);

export default router;
