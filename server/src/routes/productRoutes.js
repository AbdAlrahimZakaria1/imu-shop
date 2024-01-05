import express from "express";
import * as authController from "../controllers/authController.js";
import * as productController from "../controllers/productController.js";

const router = express.Router();

router.get("/protectedRoute", authController.protect);

router
  .route("/")
  .get(productController.getAllProducts)
  .post(productController.createProduct);

// Order here matters
// Get product by slug
// router.route("/:slug").get(productController.getProductBySlug);

router
  .route("/:id")
  // Get product by ID
  .get(productController.getProduct)
  .patch(productController.updateProduct)
  .delete(productController.deleteProduct);

export default router;
