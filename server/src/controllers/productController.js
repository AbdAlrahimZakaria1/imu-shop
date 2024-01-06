import Product from "../models/productModel.js";
import * as handlerFactory from "./handlerFactory.js";

export const createProduct = handlerFactory.createOne(Product);
export const getAllProducts = handlerFactory.getAll(Product);
export const getProduct = handlerFactory.getOne(Product, "reviews");
export const updateProduct = handlerFactory.updateOne(Product);
export const deleteProduct = handlerFactory.deleteOne(Product);

export const getProductBySlug = async (req, res, next) => {
  const doc = await Product.findOne({ slug: req.params.slug });
  res.status(200).json({
    status: "success",
    data: doc,
  });
};
