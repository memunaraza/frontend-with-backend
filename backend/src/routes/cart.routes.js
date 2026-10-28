import express from "express";
import { addToCart, clearCart, getCart, removeCartItem, updateCartItem } from "../controllers/cart.controller.js";
import { authenticateToken } from "../middlewares/auth.middleware.js";

const router = express.Router()

router.post("/items", authenticateToken, addToCart)
router.get("/", authenticateToken, getCart)
router.patch("/items/:productId", authenticateToken, updateCartItem)
router.delete("/items/:productId", authenticateToken, removeCartItem)
router.delete("/", authenticateToken, clearCart)

export default router