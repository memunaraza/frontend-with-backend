import userModel from "../models/users.model.js"
import jwt from "jsonwebtoken"
import bcrypt from "bcryptjs"
import { getJwtSecret } from "../config/environment.js"

function setAuthCookie(res, token) {
    res.cookie("token", token, {
        httpOnly: true,
        sameSite: "lax",
        secure: process.env.NODE_ENV === "production",
        path: "/"
    })
}

function toPublicUser(user) {
    return {
        _id: user._id,
        username: user.username,
        email: user.email,
        role: user.role
    }
}

async function registerUser(req, res) {
    try {
        const body = req.body ?? {}
        const username = typeof body.username === "string" ? body.username.trim() : ""
        const email = typeof body.email === "string" ? body.email.trim().toLowerCase() : ""
        const password = typeof body.password === "string" ? body.password : ""

        if (username.length < 2 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || password.length < 8) {
            return res.status(400).json({ message: "Enter a username, valid email, and password with at least 8 characters." })
        }

        const userAlreadyExists = await userModel.findOne({
            $or: [{ username }, { email }]
        })
        if (userAlreadyExists) {
            return res.status(409).json({ message: "User already exists." })
        }

        const hash = await bcrypt.hash(password, 10)
        const user = await userModel.create({ username, email, password: hash })
        const token = jwt.sign({ id: user._id, role: user.role }, getJwtSecret(), { expiresIn: "7d" })

        setAuthCookie(res, token)
        return res.status(201).json({
            message: "User created successfully",
            user: toPublicUser(user)
        })
    } catch (error) {
        if (error?.code === 11000) {
            return res.status(409).json({ message: "Username or email is already in use." })
        }
        console.error("Failed to register user:", error)
        return res.status(500).json({ message: "Unable to create your account right now." })
    }
}

async function loginUser(req, res) {
    try {
        const body = req.body ?? {}
        const rawIdentifier = body.username ?? body.email
        const identifier = typeof rawIdentifier === "string" ? rawIdentifier.trim() : ""
        const password = typeof body.password === "string" ? body.password : ""
        if (!identifier || !password) {
            return res.status(400).json({ message: "Username or email and password are required." })
        }

        const user = await userModel.findOne({
            $or: [{ username: identifier }, { email: identifier.toLowerCase() }]
        })
        if (!user || !(await bcrypt.compare(password, user.password))) {
            return res.status(401).json({ message: "Invalid username, email, or password." })
        }

        const token = jwt.sign({ id: user._id, role: user.role }, getJwtSecret(), { expiresIn: "7d" })
        setAuthCookie(res, token)
        return res.status(200).json({
            message: "User logged in successfully",
            user: toPublicUser(user)
        })
    } catch (error) {
        console.error("Failed to log in user:", error)
        return res.status(500).json({ message: "Unable to sign in right now." })
    }
}

async function getCurrentUser(req, res) {
    try {
        const user = await userModel.findById(req.user.id).select("username email role")
        if (!user) {
            res.clearCookie("token", { httpOnly: true, sameSite: "lax", secure: process.env.NODE_ENV === "production", path: "/" })
            return res.status(401).json({ message: "Your session has expired. Please sign in again." })
        }
        return res.status(200).json({ user: toPublicUser(user) })
    } catch (error) {
        console.error("Failed to load current user:", error)
        return res.status(500).json({ message: "Unable to load your account right now." })
    }
}

function logoutUser(_req, res) {
    res.clearCookie("token", { httpOnly: true, sameSite: "lax", secure: process.env.NODE_ENV === "production", path: "/" })
    return res.status(200).json({ message: "Signed out successfully." })
}

export { registerUser, loginUser, getCurrentUser, logoutUser }
