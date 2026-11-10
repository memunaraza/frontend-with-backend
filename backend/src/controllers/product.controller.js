import productModel from "../models/products.model.js";
import userModel from "../models/users.model.js";
import brandModel from "../models/brands.model.js";
import mongoose from "mongoose";
import uploadFile from "../../services/storage.service.js";
import productCategories from "../constants/product-categories.js";

async function createProduct(req, res) {
    const name = typeof req.body.name === "string" ? req.body.name.trim() : ""
    const desc = typeof req.body.desc === "string" ? req.body.desc.trim() : ""
    const price = Number(req.body.price)
    const currency = req.body.currency || "PKR"
    const brandId = req.body.brandId
    const category = req.body.category || "home"

    if (!name || name.length > 120 || !desc || desc.length > 500) {
        return res.status(400).json({ message: "Product name and description are required and must fit the stated limits." })
    }
    if (!Number.isFinite(price) || price < 0 || currency !== "PKR") {
        return res.status(400).json({ message: "Enter a valid non-negative price in PKR." })
    }
    if (!productCategories.includes(category)) {
        return res.status(400).json({ message: "Choose a valid product collection." })
    }
    if (brandId && !mongoose.isValidObjectId(brandId)) {
        return res.status(400).json({ message: "Invalid brand." })
    }

    let brand
    if (brandId) {
        brand = await brandModel.findById(brandId)
        if (!brand) return res.status(400).json({ message: "Selected brand was not found." })
    }

    let image
    if (req.file) {
        const uploaded = await uploadFile(req.file.buffer, req.file.originalname)
        image = uploaded.url
    } else if (typeof req.body.imageUrl === "string") {
        try {
            const imageUrl = new URL(req.body.imageUrl)
            if (imageUrl.protocol !== "https:") throw new Error()
            image = imageUrl.toString()
        } catch {
            return res.status(400).json({ message: "Provide an image file or a valid HTTPS image URL." })
        }
    } else {
        return res.status(400).json({ message: "A product image is required." })
    }

    const product = await productModel.create({
        image,
        name,
        desc,
        category,
        brand: brand?._id,
        price,
        currency,
        productUrl: typeof req.body.productUrl === "string" ? req.body.productUrl.trim() : undefined,
        imageAlt: typeof req.body.imageAlt === "string" ? req.body.imageAlt.trim() : name,
        priceSource: typeof req.body.priceSource === "string" ? req.body.priceSource.trim() : undefined,
        priceCheckedAt: req.body.priceSource ? new Date() : undefined,
        admin: req.user.id

    })
    await product.populate("brand", "name country website")
    res.status(201).json({
        message:"Product added",
        product
    })
}

async function getProducts(req,res){
    try {
        
        const products = await productModel.find()
            .populate("admin", "username email")
            .populate("brand", "name country website")
            .sort({ createdAt: -1, name: 1 })
        res.status(200).json({
            message:"Products fetched sucessfully",
            products
        })

    } catch (error) {
        res.status(500).json({
            message:"Failed to fetch Products",
            error:error.message
        })
    }
}

async function getProduct(req, res) {
    if (!mongoose.isValidObjectId(req.params.id)) {
        return res.status(400).json({ message: "Invalid product ID." })
    }

    try {
        const product = await productModel.findById(req.params.id)
            .populate("brand", "name country website")
        if (!product) {
            return res.status(404).json({ message: "Product not found." })
        }
        return res.status(200).json({ product })
    } catch (error) {
        console.error("Failed to fetch product:", error)
        return res.status(500).json({ message: "Unable to load this product right now." })
    }
}

export { createProduct, getProduct, getProducts }