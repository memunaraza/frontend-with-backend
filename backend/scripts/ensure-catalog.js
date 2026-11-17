import { spawnSync } from "node:child_process"
import mongoose from "mongoose"
import { fileURLToPath } from "node:url"
import "../src/config/environment.js"
import connectDB from "../src/db/db.js"
import productModel from "../src/models/products.model.js"
import userModel from "../src/models/users.model.js"

function runScript(filename) {
    const scriptPath = fileURLToPath(new URL(`./${filename}`, import.meta.url))
    const result = spawnSync(process.execPath, [scriptPath], { stdio: "inherit" })

    if (result.error) throw result.error
    if (result.status !== 0) {
        throw new Error(`${filename} exited with status ${result.status}.`)
    }
}

async function ensureCatalog() {
    await connectDB()

    let productCount
    let hasAdmin
    try {
        productCount = await productModel.countDocuments()
        if (productCount > 0) {
            console.log(`Catalog already contains ${productCount} products; skipping initialization.`)
            return
        }
        hasAdmin = Boolean(await userModel.exists({ role: "admin" }))
    } finally {
        await mongoose.disconnect()
    }

    if (!hasAdmin) runScript("create-admin.js")
    runScript("seed-international-brands.js")
    runScript("seed-real-products.js")
}

try {
    await ensureCatalog()
} catch (error) {
    console.error("Catalog initialization failed:", error.message)
    process.exitCode = 1
}
