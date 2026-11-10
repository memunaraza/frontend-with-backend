import express  from "express";
import authRoutes from "./routes/auth.routes.js";
import productRoutes from "./routes/product.routes.js";
import cartRoutes from "./routes/cart.routes.js";
import brandRoutes from "./routes/brand.routes.js";
import orderRoutes from "./routes/order.routes.js";
import contactRoutes from "./routes/contact.routes.js";
import cookieParser from "cookie-parser";
const app = express();
app.use(express.json());
app.use(cookieParser());

app.use("/api/auth", authRoutes)
app.use("/api/product",productRoutes )
app.use("/api/cart",cartRoutes )
app.use("/api/brand", brandRoutes)
app.use("/api/order", orderRoutes)
app.use("/api/contact", contactRoutes)

export default app;