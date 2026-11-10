import orderModel from "../models/orders.model.js"
import productModel from "../models/products.model.js"
import userModel from "../models/users.model.js"

const addressFields = ["firstName", "lastName", "email", "phone", "address", "apartment", "city", "region", "postalCode", "country"]

function cleanAddress(value) {
    if (!value || typeof value !== "object" || Array.isArray(value)) return null
    const address = {}
    for (const field of addressFields) {
        const raw = value[field]
        if (field === "apartment" || field === "region") {
            address[field] = typeof raw === "string" ? raw.trim().slice(0, 120) : ""
            continue
        }
        if (typeof raw !== "string" || !raw.trim() || raw.trim().length > 160) return null
        address[field] = raw.trim()
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(address.email)) return null
    return address
}

async function createOrder(req, res) {
    const shippingAddress = cleanAddress(req.body?.shippingAddress)
    if (!shippingAddress) {
        return res.status(400).json({ message: "Complete each required shipping address field with a valid email address." })
    }

    try {
        const user = await userModel.findById(req.user.id).select("cart")
        if (!user) return res.status(404).json({ message: "User not found." })
        if (!user.cart.length) return res.status(400).json({ message: "Your bag is empty." })

        const productIds = user.cart.map((item) => item.product)
        const products = await productModel.find({ _id: { $in: productIds } }).populate("brand", "name")
        const productById = new Map(products.map((product) => [product._id.toString(), product]))
        const items = []
        const totals = new Map()

        for (const cartItem of user.cart) {
            const product = productById.get(cartItem.product.toString())
            if (!product) {
                return res.status(409).json({ message: "A product in your bag is no longer available. Remove it before placing your order." })
            }
            if (typeof product.price !== "number" || !Number.isFinite(product.price)) {
                return res.status(422).json({ message: `${product.name} does not have a current price and cannot be checked out.` })
            }
            const currency = product.currency || "PKR"
            items.push({
                product: product._id,
                name: product.name,
                brand: product.brand?.name || "",
                image: product.image,
                quantity: cartItem.quantity,
                unitPrice: product.price,
                currency
            })
            totals.set(currency, (totals.get(currency) || 0) + product.price * cartItem.quantity)
        }

        const order = await orderModel.create({
            user: req.user.id,
            items,
            totalsByCurrency: [...totals].map(([currency, total]) => ({ currency, total })),
            shippingAddress
        })
        user.cart = []
        await user.save()
        return res.status(201).json({ message: "Order received. No online payment was collected.", order })
    } catch (error) {
        console.error("Failed to create order:", error)
        return res.status(500).json({ message: "Unable to place your order right now." })
    }
}

async function getOrders(req, res) {
    try {
        const orders = await orderModel.find({ user: req.user.id }).sort({ createdAt: -1 }).lean()
        return res.status(200).json({ orders })
    } catch (error) {
        console.error("Failed to load order history:", error)
        return res.status(500).json({ message: "Unable to load your order history right now." })
    }
}

export { createOrder, getOrders }
