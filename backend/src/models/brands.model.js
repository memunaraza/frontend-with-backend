import mongoose from "mongoose"

const brandSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
        unique: true,
        maxlength: 120
    },
    description: {
        type: String,
        required: true,
        trim: true,
        maxlength: 500
    },
    country: {
        type: String,
        required: true,
        trim: true,
        maxlength: 80
    },
    website: {
        type: String,
        required: true,
        trim: true,
        maxlength: 500
    },
    imageUrl: {
        type: String,
        required: true,
        trim: true,
        maxlength: 1000
    },
    imageAlt: {
        type: String,
        required: true,
        trim: true,
        maxlength: 240
    },
    imageSource: {
        type: String,
        required: true,
        trim: true,
        maxlength: 500
    }
}, { timestamps: true })

const brandModel = mongoose.model("brand", brandSchema)
export default brandModel
