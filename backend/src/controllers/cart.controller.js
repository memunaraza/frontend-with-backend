import mongoose from "mongoose"
import productModel from "../models/products.model.js"
import userModel from "../models/users.model.js"

const cartProductPopulate = {
    path: "cart.product",
    select: "name desc image price currency brand",
    populate: { path: "brand", select: "name" }
}

async function loadPopulatedCart(userId) {
    const user = await userModel.findById(userId).select("cart").populate(cartProductPopulate)
    return user
}

async function addToCart(req, res) {
    try {
        const { productId } = req.body ?? {}
        const quantity = req.body?.quantity === undefined ? 1 : Number(req.body.quantity)

        if (!mongoose.Types.ObjectId.isValid(productId)) {
            return res.status(400).json({ message: "Invalid product ID." })
        }
        if (!Number.isSafeInteger(quantity) || quantity < 1) {
            return res.status(400).json({ message: "Quantity must be a positive whole number." })
        }

        const [product, user] = await Promise.all([
            productModel.findById(productId).select("_id"),
            userModel.findById(req.user.id).select("cart")
        ])
        if (!product) return res.status(404).json({ message: "Product not found." })
        if (!user) return res.status(404).json({ message: "User not found." })

        const cartItem = user.cart.find((item) => item.product.toString() === productId)
        if (cartItem) {
            cartItem.quantity += quantity
        } else {
            user.cart.push({ product: productId, quantity })
        }
        await user.save()

        const updatedUser = await loadPopulatedCart(user._id)
        return res.status(200).json({ message: "Product added to cart.", cart: updatedUser.cart })
    } catch (error) {
        console.error("Failed to add product to cart:", error)
        return res.status(500).json({ message: "Unable to add this product to your cart right now." })
    }
}

async function getCart(req, res) {
    try {
        const user = await loadPopulatedCart(req.user.id)
        if (!user) return res.status(404).json({ message: "User not found." })
        return res.status(200).json({ cart: user.cart })
    } catch (error) {
        console.error("Failed to load cart:", error)
        return res.status(500).json({ message: "Unable to load your cart right now." })
    }
}

async function updateCartItem(req, res) {
    const { productId } = req.params
    const quantity = Number(req.body?.quantity)

    if (!mongoose.Types.ObjectId.isValid(productId)) {
        return res.status(400).json({ message: "Invalid product ID." })
    }
    if (!Number.isSafeInteger(quantity) || quantity < 1) {
        return res.status(400).json({ message: "Quantity must be a positive whole number." })
    }

    try {
        const user = await userModel.findById(req.user.id).select("cart")
        if (!user) return res.status(404).json({ message: "User not found." })

        const cartItem = user.cart.find((item) => item.product.toString() === productId)
        if (!cartItem) return res.status(404).json({ message: "Product is not in your cart." })

        cartItem.quantity = quantity
        await user.save()

        const updatedUser = await loadPopulatedCart(user._id)
        return res.status(200).json({ message: "Cart quantity updated.", cart: updatedUser.cart })
    } catch (error) {
        console.error("Failed to update cart item:", error)
        return res.status(500).json({ message: "Unable to update your cart right now." })
    }
}

async function removeCartItem(req, res) {
    const { productId } = req.params
    if (!mongoose.Types.ObjectId.isValid(productId)) {
        return res.status(400).json({ message: "Invalid product ID." })
    }

    try {
        const user = await userModel.findById(req.user.id).select("cart")
        if (!user) return res.status(404).json({ message: "User not found." })

        const cartItemIndex = user.cart.findIndex((item) => item.product.toString() === productId)
        if (cartItemIndex === -1) return res.status(404).json({ message: "Product is not in your cart." })

        user.cart.splice(cartItemIndex, 1)
        await user.save()

        const updatedUser = await loadPopulatedCart(user._id)
        return res.status(200).json({ message: "Product removed from cart.", cart: updatedUser.cart })
    } catch (error) {
        console.error("Failed to remove cart item:", error)
        return res.status(500).json({ message: "Unable to remove this product right now." })
    }
}

async function clearCart(req, res) {
    try {
        const user = await userModel.findById(req.user.id).select("cart")
        if (!user) return res.status(404).json({ message: "User not found." })

        user.cart = []
        await user.save()
        return res.status(200).json({ message: "Cart cleared.", cart: [] })
    } catch (error) {
        console.error("Failed to clear cart:", error)
        return res.status(500).json({ message: "Unable to clear your cart right now." })
    }
}

export { addToCart, getCart, updateCartItem, removeCartItem, clearCart }
