import mongoose from "mongoose"
import "../src/config/environment.js"
import brandModel from "../src/models/brands.model.js"

const brands = [
    {
        name: "Ferm Living",
        description: "Copenhagen-based design brand creating furniture, lighting, textiles, and accessories for considered homes.",
        country: "Denmark",
        website: "https://fermliving.com/",
        imageUrl: "https://fermliving.com/cdn/shop/files/Furniture_new.webp?v=1791884962&width=1080",
        imageAlt: "Furniture from Ferm Living's official furniture collection",
        imageSource: "https://fermliving.com/"
    },
    {
        name: "HAY",
        description: "Danish design company known for contemporary furniture, lighting, and useful everyday accessories.",
        country: "Denmark",
        website: "https://www.hay.com/",
        imageUrl: "https://www.hay.com/globalassets/blocks/brandsite/hays-world/news/2026-news-blocks/mags-soft-removable-cover/mags-soft-low-rc-25-seater-blomme_shim-coffe-table_apex-floor-lamp_910x1100.jpg",
        imageAlt: "HAY Mags Soft sofa with a coffee table and floor lamp",
        imageSource: "https://www.hay.com/news/news-2026/mags-soft-with-removable-cover"
    },
    {
        name: "IKEA",
        description: "Swedish-founded home furnishing company offering functional design and practical ideas for everyday living.",
        country: "Sweden",
        website: "https://www.ikea.com/",
        imageUrl: "https://www.ikea.com/global/en/media/PH_208267_7706f9c2d0.jpg",
        imageAlt: "Bright IKEA kitchen with open shelving and a seating area",
        imageSource: "https://www.ikea.com/global/en/"
    },
    {
        name: "Muuto",
        description: "Copenhagen-based Scandinavian design company creating furniture, lighting, and home accessories with a contemporary perspective.",
        country: "Denmark",
        website: "https://www.muuto.com/",
        imageUrl: "https://cdn.occtoo-media.com/4d81f22f-2795-41f2-b8bf-15e9abf03890/414c7326-bf6e-519e-a4dd-9b83f6c0d375/Coltre-3-seater-config-3-ecriture-240-muuto-5000x5000-hi-res.webp?format=medium",
        imageAlt: "Muuto Coltre three-seat sofa in a product studio",
        imageSource: "https://www.muuto.com/"
    },
    {
        name: "Allbirds",
        description: "American footwear and apparel brand known for everyday essentials made with natural and responsibly sourced materials.",
        country: "United States",
        website: "https://www.allbirds.com/",
        imageUrl: "https://www.allbirds.com/cdn/shop/files/logo-seo.jpg?v=1753720776",
        imageAlt: "Allbirds official brand mark",
        imageSource: "https://www.allbirds.com/pages/our-story"
    },
    {
        name: "Kotn",
        description: "Toronto-based apparel brand creating everyday essentials with responsibly sourced Egyptian cotton.",
        country: "Canada",
        website: "https://kotn.com/",
        imageUrl: "https://cdn.shopify.com/s/files/1/0932/1356/files/WOMENS_CARGO_POCKET_PANT_CHARCOAL_01.jpg?v=1793818955",
        imageAlt: "Women's charcoal cotton cargo pants from Kotn",
        imageSource: "https://kotn.com/products/womens-pocket-cargo-pants-in-charcoal"
    },
    {
        name: "tentree",
        description: "Canadian apparel brand making outdoor-inspired clothing with lower-impact materials.",
        country: "Canada",
        website: "https://www.tentree.com/",
        imageUrl: "https://cdn.shopify.com/s/files/1/2341/3995/files/Black-Printed-Graphic-TreeBlend-T-Shirt-TCM6279-5724_5.jpg?v=1769732044",
        imageAlt: "Northern Aurora graphic T-shirt from tentree",
        imageSource: "https://www.tentree.com/products/northern-aurora-t-shirt-meteorite-black-aurora-treeline"
    }
]

async function seedInternationalBrands() {
    const mongoUri = process.env.MONGODB_URI
    if (!mongoUri) {
        throw new Error("MONGODB_URI must be set in the backend environment.")
    }

    await mongoose.connect(mongoUri)
    let added = 0
    let updated = 0

    for (const brand of brands) {
        const existing = await brandModel.findOne({ name: brand.name }).select("_id")
        await brandModel.updateOne(
            { name: brand.name },
            { $set: brand },
            { upsert: true, runValidators: true }
        )
        if (existing) {
            updated += 1
        } else {
            added += 1
        }
    }

    console.log(`International brands complete: ${added} added, ${updated} updated.`)
}

try {
    await seedInternationalBrands()
} catch (error) {
    console.error("International brand import failed:", error.message)
    process.exitCode = 1
} finally {
    await mongoose.disconnect()
}
