import mongoose from "mongoose";
import Product from "./productModel.js";

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

// Update the ratings of the tours after CREATING a new review
reviewSchema.statics.calcAverageRatings = async function (productId) {
  const stats = await this.aggregate([
    { $match: { productId } },
    {
      $group: {
        _id: "$productId",
        nRating: { $sum: 1 },
        avgRating: { $avg: "$rating" },
      },
    },
  ]);

  if (stats.length > 0) {
    await Product.findByIdAndUpdate(productId, {
      ratingsAverage: stats[0].avgRating,
      ratingsQuantity: stats[0].nRating,
    });
  } else {
    await Product.findByIdAndUpdate(productId, {
      ratingsAverage: 4.5,
      ratingsQuantity: 0,
    });
  }
};

// To run the method above after Review is created
reviewSchema.post("save", function (next) {
  this.constructor.calcAverageRatings(this.productId);
});

// // To run the method above after either UPDATING or DELETING a review
reviewSchema.post(/^findOneAnd/, async (doc) => {
  if (doc) await doc.constructor.calcAverageRatings(doc.productId);
});

const Review = mongoose.model("Review", reviewSchema);
export default Review;
