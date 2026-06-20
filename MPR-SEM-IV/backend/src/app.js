import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

// 1. ALL IMPORTS AT THE TOP
import userRouter from './routes/auth.routes.js';
import productRouter from "./routes/product.routes.js";
import orderRouter from "./routes/order.routes.js";
import cartRoutes from "./routes/cart.routes.js";
import wishlistRouter from "./routes/wishlist.routes.js";
import artisanRoutes from './routes/artisan.routes.js';
import adminRouter from "./routes/admin.routes.js";
import reviewRouter from "./routes/review.routes.js"; // Verified singular matching file tree

const app = express();

// 2. GLOBAL MIDDLEWARES
app.use(cors({
    origin: "http://localhost:5173", 
    credentials: true
}));

app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(express.static("public"));
app.use(cookieParser());

// 3. MOUNTING ROUTES
// Review routes positioned right at the top of the stack to prevent any router intercepts
app.use("/api/v1/reviews", reviewRouter); 

// Standard business logic routes
app.use("/api/v1/users", userRouter);
app.use("/api/v1/products", productRouter);
app.use("/api/v1/orders", orderRouter);
app.use("/api/v1/cart", cartRoutes);
app.use("/api/v1/wishlist", wishlistRouter);
app.use('/api/v1/artisan', artisanRoutes);
app.use("/api/v1/admin", adminRouter);

// 4. GLOBAL FALLBACK FOR UNHANDLED PATHS (Safe replacement for the wildcard crash)
app.use((req, res) => {
    res.status(404).json({
        message: `Cannot ${req.method} ${req.originalUrl} - Route not found on this server.`,
        requestedUrl: req.originalUrl,
        method: req.method
    });
});

export { app };