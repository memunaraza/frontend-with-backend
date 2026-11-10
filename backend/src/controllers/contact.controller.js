import contactMessageModel from "../models/contact-messages.model.js"

async function createContactMessage(req, res) {
    const body = req.body ?? {}
    const message = {
        name: typeof body.name === "string" ? body.name.trim() : "",
        email: typeof body.email === "string" ? body.email.trim().toLowerCase() : "",
        subject: typeof body.subject === "string" ? body.subject.trim() : "",
        message: typeof body.message === "string" ? body.message.trim() : ""
    }

    if (!message.name || message.name.length > 100 ||
        !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(message.email) || message.email.length > 254 ||
        !message.subject || message.subject.length > 160 ||
        !message.message || message.message.length > 5000) {
        return res.status(400).json({ message: "Please provide a name, valid email, subject, and message within the stated limits." })
    }

    try {
        await contactMessageModel.create(message)
        return res.status(201).json({ message: "Thank you. Your message has been received." })
    } catch (error) {
        console.error("Failed to save contact message:", error)
        return res.status(500).json({ message: "Unable to send your message right now." })
    }
}

async function getContactMessages(_req, res) {
    try {
        const messages = await contactMessageModel.find().sort({ createdAt: -1 }).limit(100).lean()
        return res.status(200).json({ messages })
    } catch (error) {
        console.error("Failed to load contact messages:", error)
        return res.status(500).json({ message: "Unable to load contact messages right now." })
    }
}

export { createContactMessage, getContactMessages }
