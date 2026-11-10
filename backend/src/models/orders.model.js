import mongoose from "mongoose"

const orderItemSchema = new mongoose.Schema({
    product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "product",
        required: true
    },
    name: { type: String, required: true },
    brand: { type: String, default: "" },
    image: { type: String, required: true },
    quantity: { type: Number, required: true, min: 1 },
    unitPrice: { type: Number, required: true, min: 0 },
    currency: { type: String, enum: ["USD", "EUR", "PKR"], required: true }
})

const orderSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
        required: true,
        index: true
    },
    items: { type: [orderItemSchema], required: true },
    totalsByCurrency: [{
        currency: { type: String, enum: ["USD", "EUR", "PKR"], required: true },
        total: { type: Number, required: true, min: 0 }
    }],
    shippingAddress: {
        firstName: { type: String, required: true },
        lastName: { type: String, required: true },
        email: { type: String, required: true },
        phone: { type: String, required: true },
        address: { type: String, required: true },
        apartment: { type: String, default: "" },
        city: { type: String, required: true },
        region: { type: String, default: "" },
        postalCode: { type: String, required: true },
        country: { type: String, required: true }
    },
    status: {
        type: String,
        enum: ["received", "processing", "shipped", "delivered", "cancelled"],
        default: "received"
    }
}, { timestamps: true })

const orderModel = mongoose.model("order", orderSchema)
export default orderModel
