import express from "express"
import { createBrand, deleteAllBrands, deleteBrand, getBrands, updateBrand } from "../controllers/brand.controller.js"
import { authenticateToken, requireAdmin } from "../middlewares/auth.middleware.js"

const router = express.Router()

router.get("/", getBrands)
router.post("/", authenticateToken, requireAdmin, createBrand)
router.put("/:id", authenticateToken, requireAdmin, updateBrand)
router.delete("/:id", authenticateToken, requireAdmin, deleteBrand)
router.delete("/", authenticateToken, requireAdmin, deleteAllBrands)

export default router
