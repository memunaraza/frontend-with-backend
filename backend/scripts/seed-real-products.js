import mongoose from "mongoose"
import "../src/config/environment.js"
import brandModel from "../src/models/brands.model.js"
import productModel from "../src/models/products.model.js"
import userModel from "../src/models/users.model.js"

const products = [
    {
        brandName: "Ferm Living",
        name: "Ripple Glasses - Set of 4 - Clear",
        desc: "Mouth-blown clear drinking glasses with a distinctive rippled surface. Set of four.",
        image: "https://cdn.shopify.com/s/files/1/0150/3336/8640/files/339575_5438_1.png?v=1762183842",
        imageAlt: "Clear Ripple drinking glasses with a ribbed surface",
        price: 49,
        currency: "USD",
        productUrl: "https://fermliving.com/products/ripple-glasses-set-of-4-clear",
        priceSource: "https://fermliving.com/products/ripple-glasses-set-of-4-clear.js"
    },
    {
        brandName: "Ferm Living",
        name: "Vuelta Table Lamp - White",
        desc: "Sculptural opal-glass table lamp with a soft, diffused LED light and dimmer.",
        image: "https://cdn.shopify.com/s/files/1/0150/3336/8640/files/538373_110061201_10.png?v=1762182315",
        imageAlt: "White Vuelta table lamp by Ferm Living",
        price: 199,
        currency: "USD",
        productUrl: "https://fermliving.com/products/vuelta-lamp-white",
        priceSource: "https://fermliving.com/products/vuelta-lamp-white.js"
    },
    {
        brandName: "Ferm Living",
        name: "Luver Portable Lamp - Natural",
        desc: "Portable lamp with sculpted Douglas fir shades and a steam-bent wooden handle.",
        image: "https://cdn.shopify.com/s/files/1/0150/3336/8640/files/319975_1104271033_1.png?v=1762178406",
        imageAlt: "Natural wood Luver portable lamp by Ferm Living",
        price: 289,
        currency: "USD",
        productUrl: "https://fermliving.com/products/luver-portable-lamp-natural",
        priceSource: "https://fermliving.com/products/luver-portable-lamp-natural.js"
    },
    {
        brandName: "Ferm Living",
        name: "Dedali Vase - Large - Off-White",
        desc: "Large 3D-printed ceramic vase with a maze-inspired relief and sculptural opening.",
        image: "https://cdn.shopify.com/s/files/1/0150/3336/8640/files/1104269012_1.png?v=1788182809",
        imageAlt: "Large off-white Dedali ceramic vase by Ferm Living",
        price: 139,
        currency: "USD",
        productUrl: "https://fermliving.com/products/dedali-vase-off-white",
        priceSource: "https://fermliving.com/products/dedali-vase-off-white.js"
    },
    {
        brandName: "Ferm Living",
        name: "Verso Baskets - Set of 2 - Off-white",
        desc: "Pair of woven seagrass and cotton-rope baskets with contrasting wavy handles.",
        image: "https://cdn.shopify.com/s/files/1/0150/3336/8640/files/366889_1104267228_1.png?v=1762181477",
        imageAlt: "Off-white Verso woven baskets with wavy handles",
        price: 75,
        currency: "USD",
        productUrl: "https://fermliving.com/products/verso-baskets-set-of-2-off-white",
        priceSource: "https://fermliving.com/products/verso-baskets-set-of-2-off-white.js"
    },
    {
        brandName: "Ferm Living",
        name: "Desert Lounge Chair - Cashmere - Soil",
        desc: "Powder-coated steel lounge chair with a handwoven recycled-PET seat for indoor or outdoor use.",
        image: "https://cdn.shopify.com/s/files/1/0150/3336/8640/files/1103612866_1.png?v=1790001421",
        imageAlt: "Cashmere frame Desert lounge chair with soil-colored woven seat",
        price: 359,
        currency: "USD",
        productUrl: "https://fermliving.com/products/desert-lounge-chair-cashmeresoil",
        priceSource: "https://fermliving.com/products/desert-lounge-chair-cashmeresoil.js"
    },
    {
        brandName: "Muuto",
        name: "Coltre Modular Sofa - 3-Seater",
        desc: "Three-seat modular sofa with soft upholstery and configurable elements.",
        image: "https://cdn.occtoo-media.com/4d81f22f-2795-41f2-b8bf-15e9abf03890/414c7326-bf6e-519e-a4dd-9b83f6c0d375/Coltre-3-seater-config-3-ecriture-240-muuto-5000x5000-hi-res.webp?format=medium",
        imageAlt: "Muuto Coltre modular sofa in a three-seat configuration",
        price: 5795,
        currency: "EUR",
        productUrl: "https://www.muuto.com/product/Coltre-Modular-Sofa-3-Seater-Configurations--CLT3SC1/CLT3SC1TC03/",
        priceSource: "https://www.muuto.com/product/Coltre-Modular-Sofa-3-Seater-Configurations--CLT3SC1/CLT3SC1TC03/"
    },
    {
        brandName: "Muuto",
        name: "Outline Sofa - 3-Seater",
        desc: "Three-seat sofa with a refined leather upholstery and a light aluminum base.",
        image: "https://cdn.occtoo-media.com/4d81f22f-2795-41f2-b8bf-15e9abf03890/f998f5da-2585-5fba-aaf9-f8a62a5c62d1/Outline-3-seater-refine-leather-cognac-aluminum-base-Muuto-5000x5000-hi-res.webp?format=medium",
        imageAlt: "Muuto Outline three-seat sofa in cognac leather",
        price: 5995,
        currency: "EUR",
        productUrl: "https://www.muuto.com/product/Outline-Sofa-3-Seater--OU3S/OU3SCD12101/",
        priceSource: "https://www.muuto.com/product/Outline-Sofa-3-Seater--OU3S/OU3SCD12101/"
    },
    {
        brandName: "Muuto",
        name: "Connect Soft Modular Sofa - 2-Seater",
        desc: "Two-seat modular sofa with soft upholstery and a relaxed, contemporary form.",
        image: "https://cdn.occtoo-media.com/4d81f22f-2795-41f2-b8bf-15e9abf03890/34be1cc3-107a-5c06-8fb1-93a20610a942/Connect-soft-2-seater-config-2-ecriture-910-w-cushion-Muuto-5000x5000-hi-res.webp?format=medium",
        imageAlt: "Muuto Connect Soft modular sofa in a two-seat configuration",
        price: 5549,
        currency: "EUR",
        productUrl: "https://www.muuto.com/product/Connect-Soft-Modular-Sofa-2-Seater-Configurations--COS2SC1/COS2SC1CD12/",
        priceSource: "https://www.muuto.com/product/Connect-Soft-Modular-Sofa-2-Seater-Configurations--COS2SC1/COS2SC1CD12/"
    }
]

async function seedRealProducts() {
    const mongoUri = process.env.MONGODB_URI
    if (!mongoUri) {
        throw new Error("MONGODB_URI must be set in the backend environment.")
    }

    await mongoose.connect(mongoUri)
    const admin = await userModel.findOne({ role: "admin" }).select("_id")
    if (!admin) {
        throw new Error("Create an administrator before importing products.")
    }

    const brandNames = [...new Set(products.map((product) => product.brandName))]
    const brands = await brandModel.find({ name: { $in: brandNames } }).select("_id name")
    const brandsByName = new Map(brands.map((brand) => [brand.name, brand._id]))
    const missingBrands = brandNames.filter((name) => !brandsByName.has(name))
    if (missingBrands.length) {
        throw new Error(`Create these brands before importing products: ${missingBrands.join(", ")}`)
    }

    let added = 0
    let updated = 0
    for (const product of products) {
        const { brandName, ...details } = product
        const result = await productModel.updateOne(
            { productUrl: details.productUrl },
            {
                $set: {
                    ...details,
                    brand: brandsByName.get(brandName),
                    admin: admin._id
                },
                $setOnInsert: { priceCheckedAt: new Date() }
            },
            { upsert: true, runValidators: true }
        )
        if (result.upsertedCount) added += 1
        else updated += 1
    }

    console.log(`Real product collection complete: ${added} added, ${updated} updated.`)
}

try {
    await seedRealProducts()
} catch (error) {
    console.error("Real product import failed:", error.message)
    process.exitCode = 1
} finally {
    await mongoose.disconnect()
}
