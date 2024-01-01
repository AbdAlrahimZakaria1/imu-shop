import express from "express";
import * as authController from "../controllers/authController.js";

const router = express.Router();

router.get("/protectedRoute", authController.protect);

export default router;
