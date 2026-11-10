import express from "express"
import { createContactMessage, getContactMessages } from "../controllers/contact.controller.js"
import { authenticateToken, requireAdmin } from "../middlewares/auth.middleware.js"

const router = express.Router()
router.post("/", createContactMessage)
router.get("/", authenticateToken, requireAdmin, getContactMessages)

export default router
