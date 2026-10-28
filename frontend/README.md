# forma.

A component-based storefront frontend for the Express API in `../backend`.

## Run locally

Start the backend on port `3000`, then run the frontend:

```sh
npm run dev
```

Vite proxies `/api` requests to `http://localhost:3000`. To use another API origin, set `VITE_API_BASE_URL` in a frontend `.env` file.

## Connected API routes

- `GET /api/product` — load the collection
- `GET /api/product/:id` — load a product detail
- `POST /api/auth/register` and `POST /api/auth/login` — create an account or sign in
- `GET /api/brand` — load the public brand directory
- Admin-only `POST`, `PUT`, and `DELETE /api/brand` routes — manage brands
- `GET /api/cart` and `POST /api/cart/items` — view and add to the signed-in user's bag
- `PATCH /api/cart/items/:productId` — set an item quantity (positive whole number)
- `DELETE /api/cart/items/:productId` — remove one item
- `DELETE /api/cart` — clear the signed-in user's whole cart
- `POST /api/product/create` — add a product as an administrator, including its image

## Create the first administrator

In `backend/.env`, configure `MONGODB_URI`, a strong `JWT_SECRET`, and the bootstrap values `ADMIN_USERNAME`, `ADMIN_EMAIL`, and `ADMIN_PASSWORD` (at least 8 characters). Keep `.env` private and never commit it. From the `backend` directory, run:

```sh
npm run create-admin
npm start
```

To add the curated international home-design brands (with verified official-site image URLs), run `npm run seed-brands` from the backend directory. Then run `npm run seed-products` to import the real Ferm Living and Muuto catalog items, official product photography, official product links, and observed brand prices. Both imports can be safely rerun; they update only their own entries and do not remove other brands or products. Prices and availability can change; each item links to the brand's own page.

The bootstrap creates the first administrator and refuses to modify an existing account by default. To intentionally reset the existing administrator's credentials from the environment, run `npm run create-admin -- --reset-existing`. It refuses to proceed if multiple administrators exist or the configured username/email belongs to another account. Public registration always creates a regular user; admin access can only be provisioned by this local bootstrap. Sign in with the configured admin credentials to manage brands and products. Brand management supports create, edit, delete-one, and delete-all actions; deleting brands does not delete products or user accounts. Signed-in customers can add items, change quantities, remove individual items, and clear their bag.

Authentication uses an HttpOnly `token` cookie. The backend checks the admin role for every brand-management operation, regardless of what the frontend displays.
