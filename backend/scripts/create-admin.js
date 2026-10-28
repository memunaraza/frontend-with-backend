import bcrypt from "bcryptjs"
import mongoose from "mongoose"
import "../src/config/environment.js"
import userModel from "../src/models/users.model.js"

async function createAdmin() {
    const resetExisting = process.argv.includes("--reset-existing")
    const username = process.env.ADMIN_USERNAME?.trim()
    const email = process.env.ADMIN_EMAIL?.trim().toLowerCase()
    const password = process.env.ADMIN_PASSWORD
    const mongoUri = process.env.MONGODB_URI

    if (!username || username.length < 2 || !email || !password || password.length < 8) {
        throw new Error("Set ADMIN_USERNAME, ADMIN_EMAIL, and an ADMIN_PASSWORD of at least 8 characters in backend/.env.")
    }
    if (!mongoUri) {
        throw new Error("MONGODB_URI must be set in the backend environment.")
    }

    await mongoose.connect(mongoUri)
    const administrators = await userModel.find({ role: "admin" }).limit(2)
    if (administrators.length > 1) {
        throw new Error("More than one administrator already exists. Resolve the admin accounts before using this bootstrap.")
    }

    const existingAdmin = administrators[0]
    if (existingAdmin && !resetExisting) {
        throw new Error("An administrator already exists. Use --reset-existing to update its credentials.")
    }

    const conflictingUser = await userModel.findOne({
        $or: [{ username }, { email }],
        ...(existingAdmin ? { _id: { $ne: existingAdmin._id } } : {})
    })
    if (conflictingUser) {
        throw new Error("The requested username or email is already in use by another account.")
    }

    const passwordHash = await bcrypt.hash(password, 10)
    const admin = existingAdmin ?? new userModel()
    admin.username = username
    admin.email = email
    admin.password = passwordHash
    admin.role = "admin"
    await admin.save()
    console.log(existingAdmin
        ? "Existing administrator credentials updated from the environment."
        : "Administrator account created.")
}

try {
    await createAdmin()
} catch (error) {
    console.error("Admin bootstrap failed:", error.message)
    process.exitCode = 1
} finally {
    await mongoose.disconnect()
}
