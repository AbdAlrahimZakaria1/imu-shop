import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema({
  review: String,
  rating: {
    type: Number,
    required: [true, "You cannot create a review without specifying a rating!"],
    min: [1, "Minimum rating is 1"],
    max: [5, "Maximum rating is 5"],
  },
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    required: [true, "Review must belong to a product"],
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    required: [true, "Review must belong to a user"],
  },
});

const Review = mongoose.model("Review", reviewSchema);
export default Review;
