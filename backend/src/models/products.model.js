import mongoose from "mongoose"
import productCategories from "../constants/product-categories.js"

const productSchema= new mongoose.Schema({
    image:{
        type: String,
        required:true
    },
    name:  {
        type: String,
        required:true
    },
    desc: {
        type: String,
        required:true
    },
    category: {
        type: String,
        enum: productCategories,
        default: "home",
        index: true
    },
    brand: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "brand"
    },
    price: {
        type: Number,
        min: 0
    },
    currency: {
        type: String,
        enum: ["PKR"],
        default: "PKR"
    },
    productUrl: {
        type: String,
        trim: true
    },
    imageAlt: {
        type: String,
        trim: true
    },
    priceSource: {
        type: String,
        trim: true
    },
    priceCheckedAt: {
        type: Date
    },
    admin:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
        required:true
    }
}, { timestamps: true })

productSchema.index({ productUrl: 1 }, { unique: true, sparse: true })
const productModel = mongoose.model("product",productSchema)
export default productModel
