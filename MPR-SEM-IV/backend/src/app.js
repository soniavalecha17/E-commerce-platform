import express from "express"
import cors from "cors";
import cookieParser from "cookie-parser"; // 1. Import this

const app = express()

// 2. Optimized CORS (Remove the double call, just use one)
app.use(cors({
    origin: "http://localhost:5173", 
    credentials: true
}))

app.use(express.json({limit:"16kb"}))
app.use(express.urlencoded({extended: true, limit: "16kb"}))
app.use(express.static("public"))
app.use(cookieParser()) // 3. MUST add this before routes to read cookies

// Routes
import userRouter from './routes/auth.routes.js'
import productRouter from "./routes/product.routes.js";
import orderRouter from "./routes/order.routes.js";
import cartRoutes from "./routes/cart.routes.js";

app.use("/api/v1/users", userRouter)
app.use("/api/v1/products", productRouter);
app.use("/api/v1/orders", orderRouter);
app.use("/api/v1/cart", cartRoutes);

import wishlistRouter from "./routes/wishlist.routes.js";

app.use("/api/v1/wishlist", wishlistRouter);

// index.js or app.js
import artisanRoutes from './routes/artisan.routes.js'; // Adjust path as needed

// ... other middlewares
app.use('/api/v1/artisan', artisanRoutes);

// In your src/app.js
import adminRouter from "./routes/admin.routes.js";

app.use("/api/v1/admin", adminRouter);

export { app }