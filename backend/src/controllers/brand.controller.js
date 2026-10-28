import mongoose from "mongoose"
import brandModel from "../models/brands.model.js"

function validateBrandInput(body) {
    const data = body && typeof body === "object" ? body : {}
    const name = typeof data.name === "string" ? data.name.trim() : ""
    const description = typeof data.description === "string" ? data.description.trim() : ""
    const country = typeof data.country === "string" ? data.country.trim() : ""
    const website = typeof data.website === "string" ? data.website.trim() : ""
    const imageUrl = typeof data.imageUrl === "string" ? data.imageUrl.trim() : ""
    const imageAlt = typeof data.imageAlt === "string" ? data.imageAlt.trim() : ""
    const imageSource = typeof data.imageSource === "string" ? data.imageSource.trim() : ""

    if (
        !name || name.length > 120 ||
        !description || description.length > 500 ||
        !country || country.length > 80 ||
        !imageAlt || imageAlt.length > 240
    ) {
        return { error: "Brand name, description, country, and image description are required and must fit the stated limits." }
    }
    for (const [field, value] of [["website", website], ["imageUrl", imageUrl], ["imageSource", imageSource]]) {
        try {
            if (new URL(value).protocol !== "https:") throw new Error()
        } catch {
            return { error: `${field} must be a valid HTTPS URL.` }
        }
    }

    return { name, description, country, website, imageUrl, imageAlt, imageSource }
}

async function getBrands(_req, res) {
    try {
        const brands = await brandModel.find().sort({ name: 1 })
        return res.status(200).json({ brands })
    } catch (error) {
        console.error("Failed to fetch brands:", error)
        return res.status(500).json({ message: "Unable to load brands right now." })
    }
}

async function createBrand(req, res) {
    const input = validateBrandInput(req.body)
    if (input.error) return res.status(400).json({ message: input.error })

    try {
        const brand = await brandModel.create(input)
        return res.status(201).json({ message: "Brand created.", brand })
    } catch (error) {
        if (error?.code === 11000) {
            return res.status(409).json({ message: "A brand with that name already exists." })
        }
        console.error("Failed to create brand:", error)
        return res.status(500).json({ message: "Unable to create this brand right now." })
    }
}

async function updateBrand(req, res) {
    if (!mongoose.isValidObjectId(req.params.id)) {
        return res.status(400).json({ message: "Invalid brand ID." })
    }
    const input = validateBrandInput(req.body)
    if (input.error) return res.status(400).json({ message: input.error })

    try {
        const brand = await brandModel.findByIdAndUpdate(req.params.id, input, {
            new: true,
            runValidators: true
        })
        if (!brand) return res.status(404).json({ message: "Brand not found." })
        return res.status(200).json({ message: "Brand updated.", brand })
    } catch (error) {
        if (error?.code === 11000) {
            return res.status(409).json({ message: "A brand with that name already exists." })
        }
        console.error("Failed to update brand:", error)
        return res.status(500).json({ message: "Unable to update this brand right now." })
    }
}

async function deleteBrand(req, res) {
    if (!mongoose.isValidObjectId(req.params.id)) {
        return res.status(400).json({ message: "Invalid brand ID." })
    }

    try {
        const brand = await brandModel.findByIdAndDelete(req.params.id)
        if (!brand) return res.status(404).json({ message: "Brand not found." })
        return res.status(200).json({ message: "Brand deleted." })
    } catch (error) {
        console.error("Failed to delete brand:", error)
        return res.status(500).json({ message: "Unable to delete this brand right now." })
    }
}

async function deleteAllBrands(_req, res) {
    try {
        const result = await brandModel.deleteMany({})
        return res.status(200).json({ message: "All brands deleted.", deletedCount: result.deletedCount })
    } catch (error) {
        console.error("Failed to delete all brands:", error)
        return res.status(500).json({ message: "Unable to delete all brands right now." })
    }
}

export { getBrands, createBrand, updateBrand, deleteBrand, deleteAllBrands }
