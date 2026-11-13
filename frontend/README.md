# forma.

A component-based storefront frontend for the Express API in `../backend`.

## Run locally

Start the backend on port `3000`, then run the frontend:

```sh
npm run dev
```

Vite proxies `/api` requests to `http://localhost:3000`. To use another API origin, set `VITE_API_BASE_URL` in a frontend `.env` file.

For direct cross-origin API requests, configure the backend's `CORS_ORIGINS` environment variable as a comma-separated list of allowed frontend origins (for example, `http://localhost:5173`). It defaults to `http://localhost:5173` and allows credentialed requests for the authentication cookie.

## Connected API routes

- `GET /api/product` — load the collection
- `GET /api/product/:id` — load a product detail (storefront route: `/product/:id`)
- `POST /api/auth/register` and `POST /api/auth/login` — create an account or sign in
- `GET /api/auth/me` — load the signed-in profile
- `GET /api/brand` — load the public brand directory
- Admin-only `POST`, `PUT`, and `DELETE /api/brand` routes — manage brands
- `GET /api/cart` and `POST /api/cart/items` — view and add to the signed-in user's bag
- `PATCH /api/cart/items/:productId` — set an item quantity (positive whole number)
- `DELETE /api/cart/items/:productId` — remove one item
- `DELETE /api/cart` — clear the signed-in user's whole cart
- `POST /api/order` and `GET /api/order` — place an order from the signed-in user's cart and view their order history
- `POST /api/contact` — save a customer inquiry; admin-only `GET /api/contact` lists the 100 newest messages in the account page
- `POST /api/product/create` — add a product as an administrator, including its image

## Storefront pages

The storefront supports `/`, `/shop`, `/product/:id`, `/cart`, `/checkout`, `/login`, `/signup`, `/account`, `/about`, and `/contact`. The marketplace UI shows prices in PKR and supports a saved light/dark theme preference. Orders currently save a shipping address and product/price snapshot but do not collect online payment; the checkout page states this before order placement. Customer contact submissions are saved for the administrator to review in `/account`; no external recipient email or payment provider is configured.

## Create the first administrator

In `backend/.env`, configure `MONGODB_URI`, a strong `JWT_SECRET`, and the bootstrap values `ADMIN_USERNAME`, `ADMIN_EMAIL`, and `ADMIN_PASSWORD` (at least 8 characters). Keep `.env` private and never commit it. From the `backend` directory, run:

```sh
npm run create-admin
npm start
```

To add the curated international brands (with verified official-site image URLs), run `npm run seed-brands` from the backend directory. Then run `npm run seed-products` to import home, clothing, footwear, and accessories from Ferm Living, Muuto, Allbirds, Kotn, and tentree, with official product photography and links. The seed stores prices in PKR, converting the official USD/EUR prices at fixed rates of PKR 277/USD and PKR 309/EUR; rerunning the seed reapplies the same rates. It also converts any existing USD/EUR catalog prices to PKR and leaves historical orders unchanged. The seed is safe to rerun and does not remove other brands or products. Prices and availability can change; each item links to the brand's own page.

Products are organized into Clothing, Shoes, Accessories, Home & living, Furniture, Lighting, Tableware, Textiles & rugs, Storage, and Decor & art collections. All new product prices are entered and stored in PKR.

The bootstrap creates the first administrator and refuses to modify an existing account by default. To intentionally reset the existing administrator's credentials from the environment, run `npm run create-admin -- --reset-existing`. It refuses to proceed if multiple administrators exist or the configured username/email belongs to another account. Public registration always creates a regular user; admin access can only be provisioned by this local bootstrap. Sign in with the configured admin credentials to manage brands and products. Brand management supports create, edit, delete-one, and delete-all actions; deleting brands does not delete products or user accounts. Signed-in customers can add items, change quantities, remove individual items, and clear their bag.

Authentication uses an HttpOnly `token` cookie. The backend checks the admin role for every brand-management operation, regardless of what the frontend displays.
