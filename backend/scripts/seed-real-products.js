import mongoose from "mongoose"
import "../src/config/environment.js"
import brandModel from "../src/models/brands.model.js"
import productModel from "../src/models/products.model.js"
import userModel from "../src/models/users.model.js"

const products = [
    {
        brandName: "Ferm Living",
        name: "Ripple Glasses - Set of 4 - Clear",
        category: "tableware",
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
        category: "lighting",
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
        category: "lighting",
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
        category: "decor",
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
        category: "storage",
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
        category: "furniture",
        desc: "Powder-coated steel lounge chair with a handwoven recycled-PET seat for indoor or outdoor use.",
        image: "https://cdn.shopify.com/s/files/1/0150/3336/8640/files/1103612866_1.png?v=1790001421",
        imageAlt: "Cashmere frame Desert lounge chair with soil-colored woven seat",
        price: 359,
        currency: "USD",
        productUrl: "https://fermliving.com/products/desert-lounge-chair-cashmeresoil",
        priceSource: "https://fermliving.com/products/desert-lounge-chair-cashmeresoil.js"
    },
    {
        brandName: "Ferm Living",
        name: "Alas Vase - Moss Green",
        category: "decor",
        desc: "Handmade glass vase with ornamental wing-like details; each piece has its own subtle variations.",
        image: "https://cdn.shopify.com/s/files/1/0150/3336/8640/files/281247_1104268092_1.png?v=1762180586",
        imageAlt: "Moss green handmade Alas glass vase by Ferm Living",
        price: 149,
        currency: "USD",
        productUrl: "https://fermliving.com/products/alas-vase-moss-green",
        priceSource: "https://fermliving.com/products/alas-vase-moss-green.js"
    },
    {
        brandName: "Ferm Living",
        name: "Arum Portable Lamp - Cashmere",
        category: "lighting",
        desc: "Cordless rechargeable LED lamp with a three-step touch dimmer and a sculptural silhouette.",
        image: "https://cdn.shopify.com/s/files/1/0150/3336/8640/files/996299_1104269285_1.png?v=1762180208",
        imageAlt: "Cashmere Arum portable lamp by Ferm Living",
        price: 189,
        currency: "USD",
        productUrl: "https://fermliving.com/products/arum-portable-lamp-cashmere",
        priceSource: "https://fermliving.com/products/arum-portable-lamp-cashmere.js"
    },
    {
        brandName: "Ferm Living",
        name: "Apple Braided Mirror - Natural",
        category: "decor",
        desc: "Wall mirror framed in braided natural rattan, shaped as a playful apple for a child's room.",
        image: "https://cdn.shopify.com/s/files/1/0150/3336/8640/files/1104273963_1.png?v=1788770367",
        imageAlt: "Apple-shaped mirror framed with natural braided rattan",
        price: 139,
        currency: "USD",
        productUrl: "https://fermliving.com/products/apple-braided-mirror-natural",
        priceSource: "https://fermliving.com/products/apple-braided-mirror-natural.js"
    },
    {
        brandName: "Ferm Living",
        name: "Alas Bowl - Large - Moss Green",
        category: "tableware",
        desc: "Mouth-blown glass bowl with graceful wing-like details, made by hand with subtle variations.",
        image: "https://cdn.shopify.com/s/files/1/0150/3336/8640/files/103033_1104271971_1.png?v=1762177914",
        imageAlt: "Large moss green Alas glass bowl by Ferm Living",
        price: 149,
        currency: "USD",
        productUrl: "https://fermliving.com/products/alas-bowl-large-moss-green",
        priceSource: "https://fermliving.com/products/alas-bowl-large-moss-green.js"
    },
    {
        brandName: "Ferm Living",
        name: "Abode Cushion - Windows",
        category: "textiles",
        desc: "Organic cotton cushion with embroidered line drawings and a recycled polyester filling.",
        image: "https://cdn.shopify.com/s/files/1/0150/3336/8640/files/380458_1104268053_1.png?v=1762181257",
        imageAlt: "Abode cushion with embroidered windows by Ferm Living",
        price: 42,
        currency: "USD",
        productUrl: "https://fermliving.com/products/abode-cushion-windows",
        priceSource: "https://fermliving.com/products/abode-cushion-windows.js"
    },
    {
        brandName: "Ferm Living",
        name: "Ark Dining Chair - Ash",
        category: "furniture",
        desc: "FSC-certified ash dining chair with a clean plank-built form, designed for comfortable everyday dining.",
        image: "https://cdn.shopify.com/s/files/1/0150/3336/8640/files/891358_1104265720_1.png?v=1762182300",
        imageAlt: "Ash Ark dining chair by Ferm Living",
        price: 359,
        currency: "USD",
        productUrl: "https://fermliving.com/products/ark-dining-chair-ash",
        priceSource: "https://fermliving.com/products/ark-dining-chair-ash.js"
    },
    {
        brandName: "Ferm Living",
        name: "Atura Dining Table - Dark Chocolate/Dark Stained Oak",
        category: "furniture",
        desc: "Architectural dining table with a powder-coated steel frame and FSC Mix-certified oak top.",
        image: "https://cdn.shopify.com/s/files/1/0150/3336/8640/files/1104273617_1-bred.png?v=1772689241",
        imageAlt: "Atura dining table in dark chocolate and dark stained oak",
        price: 1085,
        currency: "USD",
        productUrl: "https://fermliving.com/products/atura-dining-table-dark-chocolate-dark-stained-oak",
        priceSource: "https://fermliving.com/products/atura-dining-table-dark-chocolate-dark-stained-oak.js"
    },
    {
        brandName: "Ferm Living",
        name: "Air Balloon Lamp - Oiled Oak",
        category: "lighting",
        desc: "Decorative oak-veneer pendant lamp that brings a soft, welcoming glow to a bedroom or playroom.",
        image: "https://cdn.shopify.com/s/files/1/0150/3336/8640/files/935441_100154208_1.png?v=1762184098",
        imageAlt: "Oiled oak Air Balloon pendant lamp by Ferm Living",
        price: 99,
        currency: "USD",
        productUrl: "https://fermliving.com/products/air-balloon-lamp-oiled-oak",
        priceSource: "https://fermliving.com/products/air-balloon-lamp-oiled-oak.js"
    },
    {
        brandName: "Ferm Living",
        name: "Ancora Wall Lamp - Black/Natural",
        category: "lighting",
        desc: "Wall light pairing a powder-coated iron frame with a warm, textured textile shade.",
        image: "https://cdn.shopify.com/s/files/1/0150/3336/8640/files/695439_1104268244_1.png?v=1762180840",
        imageAlt: "Ancora wall lamp in black iron and natural textile",
        price: 475,
        currency: "USD",
        productUrl: "https://fermliving.com/products/ancora-wall-lamp-100-blacknatural",
        priceSource: "https://fermliving.com/products/ancora-wall-lamp-100-blacknatural.js"
    },
    {
        brandName: "Ferm Living",
        name: "Alter Rug - 160 x 270 - Natural",
        category: "textiles",
        desc: "Handwoven rug in natural undyed wool, with stitched panels and distinctive long tassels.",
        image: "https://cdn.shopify.com/s/files/1/0150/3336/8640/files/409187_1104268130_1.png?v=1762180815",
        imageAlt: "Natural wool Alter rug by Ferm Living",
        price: 499,
        currency: "USD",
        productUrl: "https://fermliving.com/products/alter-rug-160-x-270-natural",
        priceSource: "https://fermliving.com/products/alter-rug-160-x-270-natural.js"
    },
    {
        brandName: "Ferm Living",
        name: "Amass Long Pile Rug - Off-White",
        category: "textiles",
        desc: "Hand-tufted cotton rug with a deep, tactile pile and chunky braided fringes.",
        image: "https://cdn.shopify.com/s/files/1/0150/3336/8640/files/954864_1104272014_1.png?v=1762183627",
        imageAlt: "Off-white Amass long pile cotton rug by Ferm Living",
        price: 245,
        currency: "USD",
        productUrl: "https://fermliving.com/products/amass-long-pile-rug-off-white",
        priceSource: "https://fermliving.com/products/amass-long-pile-rug-off-white.js"
    },
    {
        brandName: "Ferm Living",
        name: "Basho Tray - Oval - Brass",
        category: "accessories",
        desc: "Petite solid brass tray for serving, or keeping small everyday essentials close at hand.",
        image: "https://cdn.shopify.com/s/files/1/0150/3336/8640/files/267696_1104263842_1.png?v=1762182484",
        imageAlt: "Oval Basho solid brass tray by Ferm Living",
        price: 39,
        currency: "USD",
        productUrl: "https://fermliving.com/products/basho-tray-oval-brass",
        priceSource: "https://fermliving.com/products/basho-tray-oval-brass.js"
    },
    {
        brandName: "Ferm Living",
        name: "Bon Accessories - Petite Cup - Sand",
        category: "accessories",
        desc: "Small sand-coloured porcelain cup with a glazed interior from the Bon series.",
        image: "https://cdn.shopify.com/s/files/1/0150/3336/8640/files/519915_110226101_10.png?v=1762182208",
        imageAlt: "Sand-coloured porcelain Bon petite cup by Ferm Living",
        price: 11,
        currency: "USD",
        productUrl: "https://fermliving.com/products/bon-accessories-petite-cup-black",
        priceSource: "https://fermliving.com/products/bon-accessories-petite-cup-black.js"
    },
    {
        brandName: "Ferm Living",
        name: "Baies Napkins - Set of 4 - Natural/Dark Chocolate",
        category: "tableware",
        desc: "Set of four GOTS-certified organic cotton napkins printed with delicate berry sprigs.",
        image: "https://cdn.shopify.com/s/files/1/0150/3336/8640/files/699916_1104271888_1.png?v=1762178286",
        imageAlt: "Set of four Baies organic cotton napkins in natural and dark chocolate",
        price: 35,
        currency: "USD",
        productUrl: "https://fermliving.com/products/baies-napkins-set-of-4-natural-dark-chocolate",
        priceSource: "https://fermliving.com/products/baies-napkins-set-of-4-natural-dark-chocolate.js"
    },
    {
        brandName: "Ferm Living",
        name: "Baies Tablecloth - Natural/Dark Chocolate",
        category: "tableware",
        desc: "GOTS-certified organic cotton tablecloth with a delicate screen-printed berry pattern.",
        image: "https://cdn.shopify.com/s/files/1/0150/3336/8640/files/1104271887_1_e6e8f487-8f0d-4d40-815a-ce49d9e0152f.png?v=1759312496",
        imageAlt: "Natural organic cotton Baies tablecloth with dark chocolate berry print",
        price: 119,
        currency: "USD",
        productUrl: "https://fermliving.com/products/baies-tablecloth-natural-dark-chocolate",
        priceSource: "https://fermliving.com/products/baies-tablecloth-natural-dark-chocolate.js"
    },
    {
        brandName: "Ferm Living",
        name: "Apple Braided Storage - Natural",
        category: "storage",
        desc: "Apple-shaped braided storage basket for tidying toys, blankets, and other small treasures.",
        image: "https://cdn.shopify.com/s/files/1/0150/3336/8640/files/100178206_1.png?v=1788183494",
        imageAlt: "Apple-shaped natural braided storage basket by Ferm Living",
        price: 49,
        currency: "USD",
        productUrl: "https://fermliving.com/products/apple-braided-storage",
        priceSource: "https://fermliving.com/products/apple-braided-storage.js"
    },
    {
        brandName: "Ferm Living",
        name: "Bon Tea Organiser - Natural Oak",
        category: "storage",
        desc: "FSC-certified oak tea organiser with four compartments and a framed glass lid.",
        image: "https://cdn.shopify.com/s/files/1/0150/3336/8640/files/1104274503_1.png?v=1788766426",
        imageAlt: "Natural oak Bon tea organiser by Ferm Living",
        price: 139,
        currency: "USD",
        productUrl: "https://fermliving.com/products/bon-tea-organiser-natural-oak",
        priceSource: "https://fermliving.com/products/bon-tea-organiser-natural-oak.js"
    },
    {
        brandName: "Ferm Living",
        name: "Aperture Sculpture - Oxide",
        category: "decor",
        desc: "Sculptural painted-metal object with a distinctive architectural opening and tactile finish.",
        image: "https://cdn.shopify.com/s/files/1/0150/3336/8640/files/637957_1104268832_1.png?v=1762180355",
        imageAlt: "Oxide painted-metal Aperture sculpture by Ferm Living",
        price: 229,
        currency: "USD",
        productUrl: "https://fermliving.com/products/aperture-sculpture-oxide",
        priceSource: "https://fermliving.com/products/aperture-sculpture-oxide.js"
    },
    {
        brandName: "Ferm Living",
        name: "Ary Mini Vase - L - Sand",
        category: "decor",
        desc: "Sand-coloured porcelain mini vase with a classical silhouette, made for stems or small still lifes.",
        image: "https://cdn.shopify.com/s/files/1/0150/3336/8640/files/283763_1104264808_1.png?v=1762181424",
        imageAlt: "Sand Ary mini porcelain vase by Ferm Living",
        price: 15,
        currency: "USD",
        productUrl: "https://fermliving.com/products/ary-mini-vase-l-sand",
        priceSource: "https://fermliving.com/products/ary-mini-vase-l-sand.js"
    },
    {
        brandName: "Muuto",
        name: "Coltre Modular Sofa - 3-Seater",
        category: "furniture",
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
        category: "furniture",
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
        category: "furniture",
        desc: "Two-seat modular sofa with soft upholstery and a relaxed, contemporary form.",
        image: "https://cdn.occtoo-media.com/4d81f22f-2795-41f2-b8bf-15e9abf03890/34be1cc3-107a-5c06-8fb1-93a20610a942/Connect-soft-2-seater-config-2-ecriture-910-w-cushion-Muuto-5000x5000-hi-res.webp?format=medium",
        imageAlt: "Muuto Connect Soft modular sofa in a two-seat configuration",
        price: 5549,
        currency: "EUR",
        productUrl: "https://www.muuto.com/product/Connect-Soft-Modular-Sofa-2-Seater-Configurations--COS2SC1/COS2SC1CD12/",
        priceSource: "https://www.muuto.com/product/Connect-Soft-Modular-Sofa-2-Seater-Configurations--COS2SC1/COS2SC1CD12/"
    },
    {
        brandName: "Allbirds",
        name: "Women's Tree Runner - Mist",
        category: "shoes",
        desc: "Lightweight everyday sneaker with a breathable upper made from responsibly sourced eucalyptus fiber.",
        image: "https://cdn.shopify.com/s/files/1/1104/4168/files/TR3MMST080_SHOE_LEFT_GLOBAL_MENS_TREE_RUNNER_MIST_WHITE.png?v=1751166581",
        imageAlt: "Women's Allbirds Tree Runner sneaker in Mist with white sole",
        price: 100,
        currency: "USD",
        productUrl: "https://www.allbirds.com/products/womens-tree-runners",
        priceSource: "https://www.allbirds.com/products/womens-tree-runners.js"
    },
    {
        brandName: "Allbirds",
        name: "Men's Tree Runner - Jet Black",
        category: "shoes",
        desc: "Lightweight, breathable everyday sneaker made with responsibly sourced eucalyptus tree fiber.",
        image: "https://cdn.shopify.com/s/files/1/1104/4168/files/TR3MJBW080_SHOE_LEFT_GLOBAL_MENS_TREE_RUNNER_JET_BLACK_WHITE.png?v=1751165486",
        imageAlt: "Men's Allbirds Tree Runner sneaker in Jet Black with white sole",
        price: 100,
        currency: "USD",
        productUrl: "https://www.allbirds.com/products/mens-tree-runners",
        priceSource: "https://www.allbirds.com/products/mens-tree-runners.js"
    },
    {
        brandName: "Allbirds",
        name: "Women's Wool Cruiser - Natural Grey",
        category: "shoes",
        desc: "Everyday sneaker featuring an upper made from post-consumer recycled wool and polyester.",
        image: "https://cdn.shopify.com/s/files/1/1104/4168/files/A11724_25Q3_Wool-Cruiser-Natural-Grey-Natural-White-Sole_PDP_LEFT__1_d5b7101e-dcbb-4bbf-a3e4-d691971cf3ec.png?v=1754504857",
        imageAlt: "Women's Allbirds Wool Cruiser in Natural Grey with natural white sole",
        price: 105,
        currency: "USD",
        productUrl: "https://www.allbirds.com/products/womens-wool-cruiser-natural-grey",
        priceSource: "https://www.allbirds.com/products/womens-wool-cruiser-natural-grey.js"
    },
    {
        brandName: "Allbirds",
        name: "Women's Dream Pant - Botanic Red",
        category: "clothing",
        desc: "Soft sleep pant made with organic cotton and breathable eucalyptus fiber.",
        image: "https://cdn.shopify.com/s/files/1/1104/4168/products/A10386W002-Dream_Pant-Womens-Botanic_Red.png?v=1709142135",
        imageAlt: "Women's Allbirds Dream Pant in Botanic Red",
        price: 75,
        currency: "USD",
        productUrl: "https://www.allbirds.com/products/womens-dream-pant-botanic-red",
        priceSource: "https://www.allbirds.com/products/womens-dream-pant-botanic-red.js"
    },
    {
        brandName: "Allbirds",
        name: "Anytime Crew Sock - Natural Black",
        category: "accessories",
        desc: "Lightweight, breathable crew socks designed for everyday movement.",
        image: "https://cdn.shopify.com/s/files/1/1104/4168/products/STIUWE_SOCKS_WHEAT_FRONT_Resize_0001_SKU-SOCKS-GLOBAL-CREW-NATURAL-BLACK-1-min.png?v=1676567942",
        imageAlt: "Allbirds Anytime Crew Sock in Natural Black",
        price: 18,
        currency: "USD",
        productUrl: "https://www.allbirds.com/products/anytime-crew-sock-natural-black",
        priceSource: "https://www.allbirds.com/products/anytime-crew-sock-natural-black.js"
    },
    {
        brandName: "Allbirds",
        name: "Anytime No Show Heel Grip Sock - Blizzard",
        category: "accessories",
        desc: "No-show sock with a silicone heel grip designed to stay in place during everyday wear and workouts.",
        image: "https://cdn.shopify.com/s/files/1/1104/4168/files/A12729-front-2400x2400_2.png?v=1770422106",
        imageAlt: "Allbirds Anytime No Show Heel Grip Sock in Blizzard",
        price: 14,
        currency: "USD",
        productUrl: "https://www.allbirds.com/products/anytime-no-show-heel-grip",
        priceSource: "https://www.allbirds.com/products/anytime-no-show-heel-grip.js"
    },
    {
        brandName: "Allbirds",
        name: "Men's Wool Runner NZ - Medium Grey",
        category: "shoes",
        desc: "A refined everyday wool sneaker inspired by the original Wool Runner, with an updated fit and soft comfort.",
        image: "https://cdn.shopify.com/s/files/1/1104/4168/files/A12017_25Q3_Wool_Runner_NZ_Medium_Grey_Blizzard_Sole_PDP_LEFT.png?v=1753733610",
        imageAlt: "Men's Wool Runner NZ sneaker in medium grey by Allbirds",
        price: 77,
        currency: "USD",
        productUrl: "https://www.allbirds.com/products/mens-wool-runner-nz-medium-grey",
        priceSource: "https://www.allbirds.com/products/mens-wool-runner-nz-medium-grey.js"
    },
    {
        brandName: "Allbirds",
        name: "Women's Tree Dasher 2 - Natural White/True Navy",
        category: "shoes",
        desc: "Everyday running shoe with responsive cushioning, extra grip, and a breathable eucalyptus-fiber upper.",
        image: "https://cdn.shopify.com/s/files/1/1104/4168/files/A10572M080_Natural_White_True_Navy_Natural_White_LEFT.png?v=1721155508",
        imageAlt: "Women's Tree Dasher 2 running shoe in natural white and navy by Allbirds",
        price: 140,
        currency: "USD",
        productUrl: "https://www.allbirds.com/products/womens-tree-dashers-natural-white-true-navy",
        priceSource: "https://www.allbirds.com/products/womens-tree-dashers-natural-white-true-navy.js"
    },
    {
        brandName: "Allbirds",
        name: "Women's SuperLight Wool Runner - Natural Black",
        category: "shoes",
        desc: "Lightweight wool everyday sneaker engineered with a breathable upper and responsive SuperLight foam.",
        image: "https://cdn.shopify.com/s/files/1/1104/4168/products/SKU_SHOE_PROFILE_GLOBAL_MENS_SUPERLIGHT_WR_NATURAL_BLACK_LIGHT_GREY_ded33994-29a2-45d0-bc5f-9124d93098a8.png?v=1698105625",
        imageAlt: "Women's SuperLight Wool Runner in natural black by Allbirds",
        price: 120,
        currency: "USD",
        productUrl: "https://www.allbirds.com/products/womens-superlight-wool-runners-natural-black-light-grey",
        priceSource: "https://www.allbirds.com/products/womens-superlight-wool-runners-natural-black-light-grey.js"
    },
    {
        brandName: "Allbirds",
        name: "Men's Wool Cruiser Waterproof - Dark Grey",
        category: "shoes",
        desc: "Low-profile waterproof sneaker with a merino wool blend upper and natural rubber blend outsole.",
        image: "https://cdn.shopify.com/s/files/1/1104/4168/files/A11660_25Q3_Wool-Cruiser-Waterproof-Dark-Grey-Light-Grey-Sole_PDP_LEFT.png?v=1757024728",
        imageAlt: "Men's dark grey waterproof Wool Cruiser by Allbirds",
        price: 140,
        currency: "USD",
        productUrl: "https://www.allbirds.com/products/mens-wool-cruiser-waterproof-dark-grey",
        priceSource: "https://www.allbirds.com/products/mens-wool-cruiser-waterproof-dark-grey.js"
    },
    {
        brandName: "Allbirds",
        name: "Women's Runner NZ Slip On - Light Grey",
        category: "shoes",
        desc: "Easy slip-on sneaker with the lightweight comfort and breathable feel of the Runner NZ collection.",
        image: "https://cdn.shopify.com/s/files/1/1104/4168/files/A12558_26Q1_Runner-NZ-Slip-On-Light-Grey-Light-Grey_PDP_LEFT_ac2914e0-07bf-4d18-9478-e4b51d81d340.png?v=1768951468",
        imageAlt: "Women's light grey Runner NZ slip-on sneaker by Allbirds",
        price: 73.5,
        currency: "USD",
        productUrl: "https://www.allbirds.com/products/womens-runner-nz-slip-on-light-grey",
        priceSource: "https://www.allbirds.com/products/womens-runner-nz-slip-on-light-grey.js"
    },
    {
        brandName: "Allbirds",
        name: "Women's Canvas Runner NZ - Deep Navy Stripes",
        category: "shoes",
        desc: "Striped canvas everyday sneaker with a clean low-profile shape and comfortable natural white sole.",
        image: "https://cdn.shopify.com/s/files/1/1104/4168/files/A12500_26Q1_Runner-NZ-Canvas-Stripes-Deep-Navy-Blizzard-Sole_PDP_LEFT_bda73f01-c2a8-43d5-b680-0a4e86b8926f.png?v=1774550676",
        imageAlt: "Women's deep navy striped Canvas Runner NZ by Allbirds",
        price: 100,
        currency: "USD",
        productUrl: "https://www.allbirds.com/products/womens-canvas-runner-nz",
        priceSource: "https://www.allbirds.com/products/womens-canvas-runner-nz.js"
    },
    {
        brandName: "Kotn",
        name: "Women's Pocket Cargo Pants - Charcoal",
        category: "clothing",
        desc: "Low-rise bootcut cargo pants in 100% regenerative cotton twill with practical pockets and a structured feel.",
        image: "https://cdn.shopify.com/s/files/1/0932/1356/files/WOMENS_CARGO_POCKET_PANT_CHARCOAL_01.jpg?v=1793818955",
        imageAlt: "Women's charcoal Pocket Cargo Pants in regenerative cotton by Kotn",
        price: 168,
        currency: "USD",
        productUrl: "https://kotn.com/products/womens-pocket-cargo-pants-in-charcoal",
        priceSource: "https://kotn.com/products/womens-pocket-cargo-pants-in-charcoal.js"
    },
    {
        brandName: "Kotn",
        name: "Men's Haddah V-Neck Sweater - Light Charcoal",
        category: "clothing",
        desc: "Relaxed 100% cotton knit with a garment-dyed wash, dropped shoulders, and ribbed V-neck.",
        image: "https://cdn.shopify.com/s/files/1/0932/1356/files/MENS_HADDAH_VNECK_SWEATER_LIGHT_CHARCOAL_02.jpg?v=1793818627",
        imageAlt: "Men's light charcoal cotton Haddah V-neck sweater by Kotn",
        price: 118,
        currency: "USD",
        productUrl: "https://kotn.com/products/mens-haddah-v-neck-sweater-in-light-charcoal",
        priceSource: "https://kotn.com/products/mens-haddah-v-neck-sweater-in-light-charcoal.js"
    },
    {
        brandName: "Kotn",
        name: "Men's Varsity Polo Sweater - Bark/Pitch Navy",
        category: "clothing",
        desc: "Breathable 100% Egyptian cotton polo sweater with contrast stripes and a classic two-button collar.",
        image: "https://cdn.shopify.com/s/files/1/0932/1356/files/MENS_VARSITY_POLO_SWEATER_BARK_PITCH_NAVY_02.jpg?v=1793817908",
        imageAlt: "Men's bark and navy Varsity Polo Sweater by Kotn",
        price: 148,
        currency: "USD",
        productUrl: "https://kotn.com/products/mens-varsity-polo-sweater-in-bark-pitch-navy",
        priceSource: "https://kotn.com/products/mens-varsity-polo-sweater-in-bark-pitch-navy.js"
    },
    {
        brandName: "Kotn",
        name: "Women's Cozy Track Jacket - Black",
        category: "clothing",
        desc: "Relaxed 100% Egyptian cotton zip-up jacket with a soft brushed feel, stand collar, and two-way zip.",
        image: "https://cdn.shopify.com/s/files/1/0932/1356/files/WOMENS_COZY_TRACK_JACKET_BLACK_02.jpg?v=1793811839",
        imageAlt: "Women's black Cozy Track Jacket by Kotn",
        price: 138,
        currency: "USD",
        productUrl: "https://kotn.com/products/womens-cozy-track-jacket-in-black",
        priceSource: "https://kotn.com/products/womens-cozy-track-jacket-in-black.js"
    },
    {
        brandName: "Kotn",
        name: "Women's Shrunken Tee - Birch/Deep Ocean/Haze",
        category: "clothing",
        desc: "Cropped, slightly relaxed baby tee in midweight 100% Egyptian cotton jersey.",
        image: "https://cdn.shopify.com/s/files/1/0932/1356/files/WOMENS_SHRUNKEN_TEE_BIRCH_DEEP_OCEAN_HAZE_02.jpg?v=1793742058",
        imageAlt: "Women's striped Shrunken Tee in Egyptian cotton by Kotn",
        price: 48,
        currency: "USD",
        productUrl: "https://kotn.com/products/womens-shrunken-tee-in-birch-deep-ocean-haze",
        priceSource: "https://kotn.com/products/womens-shrunken-tee-in-birch-deep-ocean-haze.js"
    },
    {
        brandName: "Kotn",
        name: "Women's Boatneck 3/4 Sleeve Top - Tawny Port Stripe",
        category: "clothing",
        desc: "Slim-fit boatneck top in soft, breathable 100% Egyptian cotton micro rib.",
        image: "https://cdn.shopify.com/s/files/1/0932/1356/files/WOMENS_BOATNECK_3_4_SLEEVE_TOP_TAWNY_PORT_GYPSUM_THUNDERSTORM_STRIPE_02.jpg?v=1793733741",
        imageAlt: "Women's striped Boatneck three-quarter sleeve top by Kotn",
        price: 52,
        currency: "USD",
        productUrl: "https://kotn.com/products/womens-boatneck-3-4-sleeve-top-in-tawny-port-gypsum-thunderstorm-stripe",
        priceSource: "https://kotn.com/products/womens-boatneck-3-4-sleeve-top-in-tawny-port-gypsum-thunderstorm-stripe.js"
    },
    {
        brandName: "tentree",
        name: "Kessler Sweater - Warm Oak",
        category: "clothing",
        desc: "Casual organic cotton sweater with a soft three-tone gradient and a warm, easy fit.",
        image: "https://cdn.shopify.com/s/files/1/2341/3995/files/Oatmeal-Relax-Organic-Cotton-Sweater-TCW6319-5805_1.jpg?v=1753915327",
        imageAlt: "Warm oak Kessler organic cotton sweater by tentree",
        price: 58.8,
        currency: "USD",
        productUrl: "https://www.tentree.com/products/kessler-sweater-warm-oak-heather-fade",
        priceSource: "https://www.tentree.com/products/kessler-sweater-warm-oak-heather-fade.js"
    },
    {
        brandName: "tentree",
        name: "Space Dye Zip Hoodie",
        category: "clothing",
        desc: "Everyday zip hoodie blending soft organic cotton with recycled polyester.",
        image: "https://cdn.shopify.com/s/files/1/2341/3995/files/TCM4414_1330_SanMar_P_1.jpg?v=1793910309",
        imageAlt: "Space Dye zip hoodie by tentree",
        price: 98,
        currency: "USD",
        productUrl: "https://www.tentree.com/products/space-dye-zip-hoodie",
        priceSource: "https://www.tentree.com/products/space-dye-zip-hoodie.js"
    },
    {
        brandName: "tentree",
        name: "Northern Aurora T-Shirt",
        category: "clothing",
        desc: "Everyday graphic tee featuring an aurora-inspired nature print.",
        image: "https://cdn.shopify.com/s/files/1/2341/3995/files/Black-Printed-Graphic-TreeBlend-T-Shirt-TCM6279-5724_5.jpg?v=1769732044",
        imageAlt: "Meteorite black Northern Aurora graphic T-shirt by tentree",
        price: 36,
        currency: "USD",
        productUrl: "https://www.tentree.com/products/northern-aurora-t-shirt-meteorite-black-aurora-treeline",
        priceSource: "https://www.tentree.com/products/northern-aurora-t-shirt-meteorite-black-aurora-treeline.js"
    },
    {
        brandName: "tentree",
        name: "Woodford Jacket",
        category: "clothing",
        desc: "Heavyweight, retro-inspired plaid jacket made with an organic and recycled cotton blend.",
        image: "https://cdn.shopify.com/s/files/1/2341/3995/files/TCM6692_5878_A_3.png?v=1793421264",
        imageAlt: "Graphite cabin plaid Woodford jacket by tentree",
        price: 158,
        currency: "USD",
        productUrl: "https://www.tentree.com/products/woodford-jacket-graphite-cabin-plaid-1",
        priceSource: "https://www.tentree.com/products/woodford-jacket-graphite-cabin-plaid-1.js"
    },
    {
        brandName: "tentree",
        name: "Moray Sweater",
        category: "clothing",
        desc: "Ethically produced wool-blend turtleneck sweater with an original intarsia pattern.",
        image: "https://cdn.shopify.com/s/files/1/2341/3995/files/TCW5959_6409_A_3_resized.png?v=1791952119",
        imageAlt: "Pacific teal Moray wool blend sweater by tentree",
        price: 148,
        currency: "USD",
        productUrl: "https://www.tentree.com/products/moray-sweater-pacific-teal-heather-dark-grey-heather-harbour-grey-heather",
        priceSource: "https://www.tentree.com/products/moray-sweater-pacific-teal-heather-dark-grey-heather-harbour-grey-heather.js"
    },
    {
        brandName: "tentree",
        name: "Juniper T-Shirt - Pacific Teal",
        category: "clothing",
        desc: "Soft TreeBlend graphic tee combining organic cotton, recycled polyester, and TENCEL lyocell.",
        image: "https://cdn.shopify.com/s/files/1/2341/3995/files/Green-TreeBlend-Regular-Graphic-T-Shirt-TCW1756-6570_4.png?v=1784935899",
        imageAlt: "Pacific teal Juniper TreeBlend T-shirt by tentree",
        price: 45,
        currency: "USD",
        productUrl: "https://www.tentree.com/products/juniper-t-shirt-pacific-teal-heather-white",
        priceSource: "https://www.tentree.com/products/juniper-t-shirt-pacific-teal-heather-white.js"
    }
]

const pkrPerSourceCurrency = {
    USD: 277,
    EUR: 309
}

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

    const legacyProducts = await productModel.find({ currency: { $in: Object.keys(pkrPerSourceCurrency) } })
        .select("_id price currency")
    if (legacyProducts.length) {
        await productModel.bulkWrite(legacyProducts.map((product) => ({
            updateOne: {
                filter: { _id: product._id },
                update: {
                    $set: {
                        currency: "PKR",
                        ...(Number.isFinite(product.price) && pkrPerSourceCurrency[product.currency]
                            ? { price: Math.round(product.price * pkrPerSourceCurrency[product.currency]) }
                            : {})
                    }
                }
            }
        })), { ordered: true })
        console.log(`Catalog currency migration complete: ${legacyProducts.length} products stored in PKR.`)
    }

    let added = 0
    let updated = 0
    for (const product of products) {
        const { brandName, price: sourcePrice, currency: sourceCurrency, ...details } = product
        const exchangeRate = pkrPerSourceCurrency[sourceCurrency]
        if (!exchangeRate) {
            throw new Error(`Add a PKR conversion rate for ${sourceCurrency}.`)
        }
        const result = await productModel.updateOne(
            { productUrl: details.productUrl },
            {
                $set: {
                    ...details,
                    price: Math.round(sourcePrice * exchangeRate),
                    currency: "PKR",
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
