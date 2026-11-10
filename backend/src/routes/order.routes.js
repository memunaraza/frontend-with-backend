import express from "express"
import { createOrder, getOrders } from "../controllers/order.controller.js"
import { authenticateToken } from "../middlewares/auth.middleware.js"

const router = express.Router()
router.use(authenticateToken)
router.post("/", createOrder)
router.get("/", getOrders)

export default router
