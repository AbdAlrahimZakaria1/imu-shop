import Product from "../models/productModel.js";
import * as handlerFactory from "./handlerFactory.js";

export const getAllProducts = handlerFactory.getAll(Product);
export const getProduct = handlerFactory.getOne(Product);
export const createProduct = handlerFactory.createOne(Product);
export const updateProduct = handlerFactory.updateOne(Product);
export const deleteProduct = handlerFactory.deleteOne(Product);
