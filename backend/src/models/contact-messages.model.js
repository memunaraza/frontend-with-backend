import mongoose from "mongoose"

const contactMessageSchema = new mongoose.Schema({
    name: { type: String, required: true, trim: true, maxlength: 100 },
    email: { type: String, required: true, trim: true, lowercase: true, maxlength: 254 },
    subject: { type: String, required: true, trim: true, maxlength: 160 },
    message: { type: String, required: true, trim: true, maxlength: 5000 },
    status: { type: String, enum: ["new", "read"], default: "new" }
}, { timestamps: true })

const contactMessageModel = mongoose.model("contactMessage", contactMessageSchema)
export default contactMessageModel
