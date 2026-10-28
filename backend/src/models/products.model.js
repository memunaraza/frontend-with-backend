import mongoose from "mongoose"

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
        enum: ["USD", "EUR"],
        default: "USD"
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
