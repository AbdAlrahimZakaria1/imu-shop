import mongoose from "mongoose";
import slugify from "slugify";

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "A product must have a name!"],
      trim: true,
    },
    slug: String,
    description: {
      type: String,
      maxlength: [200, "Description has a limit of 200 characters"],
    },
    material: {
      type: String,
      maxlength: [200, "Materials has a limit of 200 characters"],
    },
    price: {
      type: Number,
      required: [true, "A tour must have a price"],
    },
    priceDiscount: {
      type: Number,
      default: 0,
      validate: {
        // "this" Only works on current document creation (doesn't work on updating)
        validator: function (value) {
          return this.price > value;
        },
        message: "Price discount ({VALUE}) must be lower than the normal price",
      },
    },
    imageCover: String,
    images: [String],
    createdAt: {
      type: Date,
      default: Date.now(),
      select: false,
    },
    ratingsAverage: {
      type: Number,
      default: 4.5,
      min: [1, "AvgRating must be higher or equal than 1"],
      max: [5, "AvgRating must be lower or equal than 5"],
      set: (value) => Math.round(value * 10) / 10,
    },
    ratingsQuantity: {
      type: Number,
      default: 0,
    },
    variatationAttributes: {
      color: {
        sku: {
          type: Number,
          required: [true, "A color must have a sku vavlue."],
        },
        label: String,
      },
      sizes: [
        {
          _id: false,
          sku: {
            type: Number,
            required: [true, "A color must have a sku vavlue."],
          },
          label: String,
          inventory: {
            type: Number,
            default: 0,
            required: [true, "Size must have a stock quantity."],
          },
        },
      ],
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Middlewares
productSchema.pre("save", function () {
  this.slug = slugify(this.name, { lower: true });
});

// Virtuals
productSchema.virtual("reviews", {
  ref: "Review",
  foreignField: "productId",
  localField: "_id",
});

// Model
const Product = mongoose.model("Product", productSchema);
export default Product;
