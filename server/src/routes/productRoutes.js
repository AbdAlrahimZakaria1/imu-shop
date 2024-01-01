import express from "express";
import * as authController from "../controllers/authController.js";
import * as productController from "../controllers/productController.js";

const router = express.Router();

router.get("/protectedRoute", authController.protect);

router
  .route("/")
  .get(productController.getAllProducts)
  .post(productController.createProduct);

router
  .route("/:id")
  .get(productController.getProduct)
  .patch(productController.updateProduct)
  .delete(productController.deleteProduct);

export default router;
